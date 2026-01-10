'use server';

import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { SERVICES } from '@/app/constants/constants';
import { MOCK_BARBERS } from '@/app/constants/booking';

async function getAdminUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(sessionCookie);

        if (decodedToken.role !== 'admin') {
            return null;
        }

        return decodedToken;
    } catch (error) {
        return null;
    }
}

// Helper function to look up price
const getServicePrice = (id: string): number => {
    const service = SERVICES.find(s => s.id === id);
    return service ? service.price : 0;
};

// Helper function to look up barber name
const getBarberName = (id: string): string => {
    const barber = MOCK_BARBERS.find(b => b.id === id);
    return barber ? barber.name : 'Sin asignar';
};

export async function getDashboardData(date: string) {
    const admin = await getAdminUser();
    if (!admin) throw new Error('Unauthorized');

    try {
        const snapshot = await adminDb.collection('appointments')
            .where('date', '==', date)
            .get();

        const appointments = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                price: getServicePrice(data.serviceId)
            };
        });

        const totalRevenue = appointments.reduce((sum, apt: any) => sum + (apt.price || 0), 0);
        const totalAppointments = appointments.length;
        const uniqueClients = new Set(appointments.map((apt: any) => apt.clientEmail || apt.clientName)).size;

        return {
            stats: {
                revenue: totalRevenue,
                bookings: totalAppointments,
                clients: uniqueClients
            },
            appointments: appointments.map((apt: any) => ({
                id: apt.id,
                time: apt.time,
                clientName: apt.clientName || 'Cliente',
                service: apt.serviceName || 'Servicio',
                duration: '45 min',
                status: apt.status,
                barberId: apt.barberId,
                barberName: getBarberName(apt.barberId),
                type: 'appointment'
            }))
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return {
            stats: { revenue: 0, bookings: 0, clients: 0 },
            appointments: []
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

    // Send Notification if client email exists
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
            createdAt: new Date().toISOString() // Using string for server action compatibility, can convert to timestamp if needed by client
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
    // This is a helper to set the admin role for a user
    // In a real app, this should be protected or removed after use
    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
    return { success: true };
}

export async function blockSlot(date: string, time: string, barberId: string = 'b1') { // Default to first barber for now if not multi-barber
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
        // 1. Fetch all users from Firebase Auth
        const listUsersResult = await adminAuth.listUsers(1000);
        const authUsers = listUsersResult.users;

        console.log('Fetched Auth Users:', authUsers.map(u => ({ email: u.email, photo: u.photoURL, name: u.displayName })));


        // 2. Fetch all appointments to calculate stats
        const appointmentsSnapshot = await adminDb.collection('appointments')
            .orderBy('date', 'desc')
            .get();

        const allAppointments = appointmentsSnapshot.docs.map(doc => doc.data());

        // 3. Process each user
        const enrichedUsers = authUsers.map((user) => {
            const userAppointments = allAppointments.filter((apt: any) =>
                apt.clientEmail === user.email || apt.clientId === user.uid
            );

            const visitCount = userAppointments.length;
            const lastVisit = userAppointments.length > 0 ? userAppointments[0].date : null;
            const firstVisit = userAppointments.length > 0 ? userAppointments[userAppointments.length - 1].date : null;

            // Determine Status
            let status = 'Nuevo'; // Default for 0 visits or very recent first visit
            let statusType = 'new'; // For UI implementation logic

            const now = new Date();
            const lastVisitDate = lastVisit ? new Date(lastVisit) : null;
            const firstVisitDate = firstVisit ? new Date(firstVisit) : null;

            // Check creation time if no visits
            const creationTime = new Date(user.metadata.creationTime);
            const daysSinceCreation = Math.floor((now.getTime() - creationTime.getTime()) / (1000 * 3600 * 24));

            if (visitCount === 0) {
                if (daysSinceCreation > 30) {
                    status = 'Sin Visitas';
                    statusType = 'inactive';
                } else {
                    status = 'Nuevo';
                    statusType = 'new';
                }
            } else if (visitCount > 3) {
                status = 'Frecuente';
                statusType = 'frequent';
            } else if (lastVisitDate) {
                const daysSinceLastVisit = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24));
                if (daysSinceLastVisit > 60) {
                    status = 'Inactivo';
                    statusType = 'inactive';
                } else {
                    status = 'Activo'; // Regular active user
                    statusType = 'active';
                }
            }

            return {
                id: user.uid,
                name: user.displayName || 'Sin Nombre',
                email: user.email || 'Sin Email',
                avatar: user.photoURL || user.providerData?.[0]?.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`,
                visitCount,
                lastVisit: lastVisit || 'N/A',
                status,
                statusType,
                role: user.customClaims?.role || 'user'
            };
        });

        return enrichedUsers;

    } catch (error) {
        console.error('Error getting admin users:', error);
        return [];
    }
}
