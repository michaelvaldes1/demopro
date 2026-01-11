'use server';

import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { SERVICES } from '@/app/constants/constants';
import { MOCK_BARBERS } from '@/app/constants/booking';
import { format, subDays, parseISO } from 'date-fns';

async function getAdminUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(sessionCookie);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

// Internal helper for admin check
async function getAdminCheck() {
    const admin = await getAdminUser();
    if (!admin || admin.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    return admin;
}

// Helper function to look up price
const getServicePrice = (id: string): number => {
    const service = SERVICES.find(s => s.id === id);
    return service ? service.price : 0;
};

// Helper function to look up barber name
const getBarberName = async (id: string): Promise<string> => {
    if (!id) return 'Sin asignar';
    try {
        const doc = await adminDb.collection('barbers').doc(id).get();
        if (doc.exists) return doc.data()?.name || 'Sin asignar';

        // Fallback to mocks for existing appointments if migration is ongoing
        const barber = MOCK_BARBERS.find(b => b.id === id);
        return barber ? barber.name : 'Sin asignar';
    } catch {
        return 'Sin asignar';
    }
};

export async function getBarbers() {
    try {
        const snapshot = await adminDb.collection('barbers').get();
        const barbers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any[];

        if (barbers.length === 0) {
            return [];
        }
        return barbers;
    } catch (error) {
        console.error('Error fetching barbers:', error);
        return MOCK_BARBERS;
    }
}

export async function addBarber(barberData: any) {
    await getAdminCheck();

    if (!barberData.name || !barberData.role || !barberData.imageUrl) {
        throw new Error('Todos los campos obligatorios (nombre, rol, imagen) deben estar presentes.');
    }

    const docRef = await adminDb.collection('barbers').add({
        ...barberData,
        isAvailable: true,
        createdAt: new Date().toISOString()
    });
    return { id: docRef.id, success: true };
}

export async function updateBarber(id: string, barberData: any) {
    await getAdminCheck();

    if (!barberData.name || !barberData.role || !barberData.imageUrl) {
        throw new Error('Todos los campos obligatorios (nombre, rol, imagen) deben estar presentes.');
    }

    await adminDb.collection('barbers').doc(id).update({
        ...barberData,
        updatedAt: new Date().toISOString()
    });
    return { success: true };
}

export async function deleteBarber(id: string) {
    await getAdminCheck();
    await adminDb.collection('barbers').doc(id).delete();
    return { success: true };
}

export async function getDashboardData(date: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    try {
        const currentDate = date;
        const prevDate = format(subDays(parseISO(date), 1), 'yyyy-MM-dd');

        const [currentSnapshot, prevSnapshot] = await Promise.all([
            adminDb.collection('appointments').where('date', '==', currentDate).get(),
            adminDb.collection('appointments').where('date', '==', prevDate).get()
        ]);

        const mapAppointments = (snapshot: any) => snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                price: getServicePrice(data.serviceId)
            };
        });

        const currentApts = mapAppointments(currentSnapshot);
        const prevApts = mapAppointments(prevSnapshot);

        const calculateStats = (apts: any[]) => {
            const active = apts.filter(a => a.status !== 'blocked');
            return {
                revenue: active.reduce((sum, a) => sum + (a.price || 0), 0),
                bookings: active.length,
                clients: new Set(active.map(a => a.clientEmail || a.clientName)).size
            };
        };

        const currentStats = calculateStats(currentApts);
        const prevStats = calculateStats(prevApts);

        // Process barber names in parallel
        const appointments = await Promise.all(currentApts.map(async (apt: any) => {
            const currentBarberName = await getBarberName(apt.barberId);
            const finalBarberName = (currentBarberName !== 'Sin asignar')
                ? currentBarberName
                : (apt.barberName || 'Sin asignar');

            return {
                id: apt.id,
                time: apt.time,
                clientName: apt.clientName || 'Cliente',
                service: apt.serviceName || apt.service || 'Servicio',
                duration: apt.duration || '45 min',
                status: apt.status,
                barberId: apt.barberId,
                barberName: finalBarberName,
                price: apt.price,
                type: 'appointment'
            };
        }));

        return {
            stats: currentStats,
            prevStats: prevStats,
            appointments,
            prevAppointments: prevApts.map((apt: any) => ({
                id: apt.id,
                barberId: apt.barberId,
                status: apt.status,
                price: apt.price,
                clientName: apt.clientName
            }))
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return {
            stats: { revenue: 0, bookings: 0, clients: 0 },
            prevStats: { revenue: 0, bookings: 0, clients: 0 },
            appointments: [],
            prevAppointments: []
        };
    }
}

export async function getAllAppointments() {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    const snapshot = await adminDb.collection('appointments').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function updateAppointmentStatus(id: string, status: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    const appointmentRef = adminDb.collection('appointments').doc(id);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) throw new Error('Cita no encontrada');
    const appointmentData = appointmentDoc.data();

    await appointmentRef.update({
        status,
        updatedAt: new Date().toISOString(),
    });

    if (appointmentData?.clientEmail) {
        const statusMessages: { [key: string]: string } = {
            'confirmed': 'Tu cita ha sido confirmada.',
            'completed': 'Tu cita ha sido marcada como completada. ¡Gracias por tu visita!',
            'cancelled': 'Tu cita ha sido cancelada.',
            'no-show': 'Tu cita ha sido marcada como "No Asistió".',
            'blocked': 'Tu cita no puede realizarse.'
        };

        const message = statusMessages[status] || `El estado de tu cita ha cambiado a ${status}.`;

        await adminDb.collection('notifications').add({
            userId: appointmentData.clientEmail,
            title: 'Actualización de Cita',
            message: `${message} (${appointmentData.date} a las ${appointmentData.time})`,
            isRead: false,
            createdAt: new Date().toISOString()
        });
    }

    return { success: true };
}

export async function deleteAppointment(id: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    await adminDb.collection('appointments').doc(id).delete();
    return { success: true };
}

export async function setUserAsAdmin(uid: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
    return { success: true };
}

export async function removeAdminRole(uid: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    if (admin.uid === uid) {
        throw new Error('No puedes quitarte el rol de administrador a ti mismo.');
    }

    await adminAuth.setCustomUserClaims(uid, { role: 'user' });
    return { success: true };
}

export async function blockSlot(date: string, time: string, barberId: string = 'b1') {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    await adminDb.collection('appointments').add({
        date,
        time,
        barberId,
        status: 'blocked',
        serviceId: 'blocked',
        serviceName: 'Bloqueado',
        clientName: 'Admin',
        createdAt: new Date().toISOString(),
    });

    return { success: true };
}

export async function getAdminUsers() {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    try {
        const listUsersResult = await adminAuth.listUsers(1000);
        const authUsers = listUsersResult.users;

        const appointmentsSnapshot = await adminDb.collection('appointments')
            .orderBy('date', 'desc')
            .get();

        const allAppointments = appointmentsSnapshot.docs.map(doc => doc.data());
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const now = new Date();

        const enrichedUsers = authUsers.map((user) => {
            const userEmail = user.email?.toLowerCase();
            const userAppointments = allAppointments.filter((apt: any) =>
                (apt.clientEmail?.toLowerCase() === userEmail || apt.clientId === user.uid) && apt.status !== 'blocked'
            );

            const pastAppointments = userAppointments.filter((apt: any) => apt.date <= todayStr);
            const visitCount = pastAppointments.length;
            const lastVisit = pastAppointments.length > 0 ? pastAppointments[0].date : null;

            let status = 'Nuevo';
            let statusType = 'new';

            const lastVisitDate = lastVisit ? new Date(lastVisit) : null;
            const creationTime = new Date(user.metadata.creationTime);
            const daysSinceCreation = Math.floor((now.getTime() - creationTime.getTime()) / (1000 * 3600 * 24));

            if (lastVisitDate) {
                const daysSinceLastVisit = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24));

                if (daysSinceLastVisit <= 8) {
                    status = 'Frecuente';
                    statusType = 'frequent';
                } else if (daysSinceLastVisit <= 30) {
                    status = 'Activo';
                    statusType = 'active';
                } else if (daysSinceLastVisit >= 45) {
                    status = 'Inactivo';
                    statusType = 'inactive';
                } else {
                    status = 'Regular';
                    statusType = 'active';
                }
            } else if (daysSinceCreation <= 15) {
                status = 'Nuevo';
                statusType = 'new';
            } else {
                status = 'Sin Visitas';
                statusType = 'inactive';
            }

            return {
                id: user.uid,
                name: user.displayName || 'Sin Nombre',
                email: user.email || 'Sin Email',
                avatar: user.photoURL || user.providerData?.[0]?.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`,
                visitCount,
                lastVisit: lastVisit ? format(parseISO(lastVisit), 'dd-MM-yyyy') : 'N/A',
                status,
                statusType,
                daysSinceCreation,
                daysSinceLastVisit: lastVisitDate ? Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24)) : null,
                role: user.customClaims?.role || 'user'
            };
        });

        return enrichedUsers;
    } catch (error) {
        console.error('Error getting admin users:', error);
        return [];
    }
}
