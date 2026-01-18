'use server';

import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';
import { uploadImageToStorage, deleteBarberImages } from '@/lib/storageHelpers';
import { cookies } from 'next/headers';
import { SERVICES } from '@/app/constants/constants';
import { MOCK_BARBERS } from '@/app/constants/booking';
import { format, subDays, parseISO } from 'date-fns';
import { cache } from 'react';
import { revalidatePath } from 'next/cache';

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

// Helper function to create audit logs
async function createAuditLog({
    adminEmail,
    action,
    resourceType,
    resourceId,
    resourceName,
    metadata
}: {
    adminEmail: string;
    action: 'create' | 'update' | 'delete' | 'status_change' | 'block';
    resourceType: 'appointment' | 'service' | 'barber' | 'user';
    resourceId: string;
    resourceName: string;
    metadata?: any;
}) {
    try {
        await adminDb.collection('auditLogs').add({
            adminEmail,
            action,
            resourceType,
            resourceId,
            resourceName,
            metadata: metadata || {},
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
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

async function updateUserStats(userId: string | undefined, userEmail: string | undefined, userName: string | undefined, date: string) {
    if (!userEmail) return;

    try {
        // Standardize: Use lowercase email as the unique document ID
        const docId = userEmail.toLowerCase();
        const userRef = adminDb.collection('users').doc(docId);

        await userRef.set({
            email: userEmail.toLowerCase(),
            name: userName || 'Cliente',
            visitCount: admin.firestore.FieldValue.increment(1),
            lastVisit: date,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

async function processAutoCompletions() {
    try {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        // Find confirmed appointments that are past due
        // For simplicity, we auto-complete anything from yesterday or older
        // Today's appointments will be auto-completed tomorrow or can be manually done
        const snapshot = await adminDb.collection('appointments')
            .where('status', '==', 'confirmed')
            .where('date', '<', todayStr)
            .limit(50) // Process in reasonable batches to avoid blocking the UI
            .get();

        if (snapshot.empty) return;

        const batch = adminDb.batch();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            batch.update(doc.ref, {
                status: 'completed',
                updatedAt: new Date().toISOString(),
                autoCompleted: true
            });

            // Update user stats for each auto-completed appointment
            await updateUserStats(data.userId, data.clientEmail, data.clientName, data.date);
        }

        await batch.commit();
        console.log(`Auto-completed ${snapshot.size} appointments.`);
    } catch (error) {
        console.error('Error in processAutoCompletions:', error);
    }
}

export const getBarbers = cache(async () => {
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
});

export async function addBarber(barberData: any) {
    const admin = await getAdminCheck();

    if (!barberData.name || !barberData.role || !barberData.imageUrl) {
        throw new Error('Todos los campos obligatorios (nombre, rol, imagen) deben estar presentes.');
    }

    // Create barber document first to get ID
    const docRef = await adminDb.collection('barbers').add({
        name: barberData.name,
        role: barberData.role,
        socials: barberData.socials || {},
        isAvailable: true,
        createdAt: new Date().toISOString()
    });

    try {
        // Upload profile image to Storage
        const profileImageUrl = await uploadImageToStorage(
            barberData.imageUrl,
            `barbers/${docRef.id}/profile.jpg`
        );

        // Upload portfolio images to Storage
        const portfolioUrls: string[] = [];
        if (barberData.portfolioImages && barberData.portfolioImages.length > 0) {
            for (let i = 0; i < barberData.portfolioImages.length; i++) {
                const imageUrl = await uploadImageToStorage(
                    barberData.portfolioImages[i],
                    `barbers/${docRef.id}/portfolio/${i}.jpg`
                );
                portfolioUrls.push(imageUrl);
            }
        }

        // Update document with Storage URLs
        await adminDb.collection('barbers').doc(docRef.id).update({
            imageUrl: profileImageUrl,
            portfolioImages: portfolioUrls
        });

        await createAuditLog({
            adminEmail: admin.email || 'unknown',
            action: 'create',
            resourceType: 'barber',
            resourceId: docRef.id,
            resourceName: barberData.name,
            metadata: { role: barberData.role }
        });

        return { id: docRef.id, success: true };
    } catch (error) {
        // If upload fails, delete the document
        await adminDb.collection('barbers').doc(docRef.id).delete();
        throw error;
    }
}

export async function updateBarber(id: string, barberData: any) {
    const admin = await getAdminCheck();

    if (!barberData.name || !barberData.role || !barberData.imageUrl) {
        throw new Error('Todos los campos obligatorios (nombre, rol, imagen) deben estar presentes.');
    }

    // Check if profile image is Base64 (new upload) or URL (existing)
    let profileImageUrl = barberData.imageUrl;
    if (barberData.imageUrl.startsWith('data:image')) {
        // Delete old profile image and upload new one
        profileImageUrl = await uploadImageToStorage(
            barberData.imageUrl,
            `barbers/${id}/profile.jpg`
        );
    }

    // Handle portfolio images
    const portfolioUrls: string[] = [];
    if (barberData.portfolioImages && barberData.portfolioImages.length > 0) {
        for (let i = 0; i < barberData.portfolioImages.length; i++) {
            const img = barberData.portfolioImages[i];
            if (img.startsWith('data:image')) {
                // New image - upload to Storage
                const imageUrl = await uploadImageToStorage(
                    img,
                    `barbers/${id}/portfolio/${i}.jpg`
                );
                portfolioUrls.push(imageUrl);
            } else if (img.startsWith('http')) {
                // Existing image - keep URL
                portfolioUrls.push(img);
            }
        }
    }

    // Restructure to use socials object for consistency
    const updateData = {
        name: barberData.name,
        role: barberData.role,
        imageUrl: profileImageUrl,
        socials: {
            whatsapp: barberData.whatsapp || '',
            instagram: barberData.instagram || '',
            tiktok: barberData.tiktok || ''
        },
        portfolioImages: portfolioUrls,
        updatedAt: new Date().toISOString()
    };

    await adminDb.collection('barbers').doc(id).update(updateData);

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'update',
        resourceType: 'barber',
        resourceId: id,
        resourceName: barberData.name,
        metadata: { role: barberData.role }
    });

    return { success: true };
}

export async function deleteBarber(id: string) {
    const admin = await getAdminCheck();

    const barberDoc = await adminDb.collection('barbers').doc(id).get();
    const barberName = barberDoc.exists ? barberDoc.data()?.name || 'Unknown' : 'Unknown';

    // Delete barber document
    await adminDb.collection('barbers').doc(id).delete();

    // Delete all images from Storage
    await deleteBarberImages(id);

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'delete',
        resourceType: 'barber',
        resourceId: id,
        resourceName: barberName
    });

    return { success: true };
}

export async function toggleBarberStatus(id: string, currentStatus: boolean) {
    const admin = await getAdminCheck();

    const barberDoc = await adminDb.collection('barbers').doc(id).get();
    const barberName = barberDoc.exists ? barberDoc.data()?.name || 'Unknown' : 'Unknown';

    await adminDb.collection('barbers').doc(id).update({
        isAvailable: !currentStatus,
        updatedAt: new Date().toISOString()
    });

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'status_change',
        resourceType: 'barber',
        resourceId: id,
        resourceName: barberName,
        metadata: { oldStatus: currentStatus, newStatus: !currentStatus }
    });

    return { success: true };
}

export const getDashboardData = cache(async (date: string) => {
    const adminUser = await getAdminCheck();

    // Auto-complete past appointments
    await processAutoCompletions();

    try {
        const currentDate = date;
        const prevDate = format(subDays(parseISO(date), 1), 'yyyy-MM-dd');

        const [currentSnapshot, prevSnapshot, servicesSnapshot] = await Promise.all([
            adminDb.collection('appointments').where('date', '==', currentDate).get(),
            adminDb.collection('appointments').where('date', '==', prevDate).get(),
            adminDb.collection('services').get()
        ]);

        const dbServices = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        const getRealtimeServicePrice = (id: string): number => {
            const service = dbServices.find(s => s.id === id);
            if (service) return Number(service.price);

            // Fallback to static constants for legacy
            const staticService = SERVICES.find(s => s.id === id);
            return staticService ? staticService.price : 0;
        };

        const mapAppointments = (snapshot: any) => snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                price: data.price !== undefined ? Number(data.price) : getRealtimeServicePrice(data.serviceId)
            };
        });

        const currentApts = mapAppointments(currentSnapshot);
        const prevApts = mapAppointments(prevSnapshot);

        // Enrich current appointments with user info (avatar, email)
        const userEmails = Array.from(new Set(currentApts.map((a: any) => a.clientEmail).filter(Boolean)));
        let userMap: Record<string, any> = {};

        if (userEmails.length > 0) {
            const usersSnapshot = await adminDb.collection('users')
                .where('email', 'in', userEmails)
                .get();

            usersSnapshot.docs.forEach(doc => {
                const userData = doc.data();
                userMap[userData.email.toLowerCase()] = {
                    avatar: userData.avatar,
                    email: userData.email
                };
            });
        }

        const enrichedCurrentApts = currentApts.map((apt: any) => {
            const userData = userMap[apt.clientEmail?.toLowerCase()];
            const clientName = apt.clientName || 'Cliente';
            // Use stored avatar, or fallback to UI-avatars if missing
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=random&color=fff`;

            return {
                ...apt,
                clientAvatar: userData?.avatar || fallbackAvatar,
                clientEmail: apt.clientEmail || userData?.email || 'N/A'
            };
        });

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
        const appointments = await Promise.all(enrichedCurrentApts.map(async (apt: any) => {
            const currentBarberName = await getBarberName(apt.barberId);
            const finalBarberName = (currentBarberName !== 'Sin asignar')
                ? currentBarberName
                : (apt.barberName || 'Sin asignar');

            return {
                id: apt.id,
                time: apt.time,
                clientName: apt.clientName || 'Cliente',
                clientEmail: apt.clientEmail,
                clientAvatar: apt.clientAvatar,
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
});

export async function getAllAppointments() {
    await getAdminCheck();

    const snapshot = await adminDb.collection('appointments').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function updateAppointmentStatus(id: string, status: string) {
    const admin = await getAdminCheck();


    const appointmentRef = adminDb.collection('appointments').doc(id);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) throw new Error('Cita no encontrada');
    const appointmentData = appointmentDoc.data();
    const oldStatus = appointmentData?.status;

    await appointmentRef.update({
        status,
        updatedAt: new Date().toISOString(),
    });

    // Notify n8n of the status change
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
        try {
            await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...appointmentData,
                    status, // Updated status
                    updatedAt: new Date().toISOString(),
                    action: 'status_change_admin'
                })
            });
        } catch (error) {
            console.error('Error sending status change to n8n:', error);
        }
    }

    // If marked as completed, update user stats
    if (status === 'completed') {
        await updateUserStats(
            appointmentData?.userId,
            appointmentData?.clientEmail,
            appointmentData?.clientName,
            appointmentData?.date
        );
    }

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

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'status_change',
        resourceType: 'appointment',
        resourceId: id,
        resourceName: `${appointmentData?.clientName || 'Cliente'} - ${appointmentData?.serviceName || 'Servicio'}`,
        metadata: { oldStatus, newStatus: status, date: appointmentData?.date, time: appointmentData?.time }
    });

    return { success: true };
}

export async function deleteAppointment(id: string) {
    const admin = await getAdminCheck();

    const appointmentDoc = await adminDb.collection('appointments').doc(id).get();
    const appointmentData = appointmentDoc.data();

    await adminDb.collection('appointments').doc(id).delete();

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'delete',
        resourceType: 'appointment',
        resourceId: id,
        resourceName: `${appointmentData?.clientName || 'Cliente'} - ${appointmentData?.serviceName || 'Servicio'}`,
        metadata: { date: appointmentData?.date, time: appointmentData?.time, status: appointmentData?.status }
    });

    return { success: true };
}

export async function setUserAsAdmin(uid: string) {
    await getAdminCheck();

    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });

    // Sync with users collection (using email as ID)
    const user = await adminAuth.getUser(uid);
    if (user.email) {
        await adminDb.collection('users').doc(user.email.toLowerCase()).set({
            role: 'admin',
            avatar: user.photoURL || null,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }
    return { success: true };
}

export async function removeAdminRole(uid: string) {
    const admin = await getAdminCheck();

    if (admin.uid === uid) {
        throw new Error('No puedes quitarte el rol de administrador a ti mismo.');
    }

    await adminAuth.setCustomUserClaims(uid, { role: 'user' });

    // Sync with users collection (using email as ID)
    const user = await adminAuth.getUser(uid);
    if (user.email) {
        await adminDb.collection('users').doc(user.email.toLowerCase()).set({
            role: 'user',
            avatar: user.photoURL || null,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }
    return { success: true };
}

export async function blockSlot(date: string, time: string, barberId: string) {
    const admin = await getAdminCheck();

    const docRef = await adminDb.collection('appointments').add({
        date,
        time,
        barberId,
        status: 'blocked',
        serviceId: 'blocked',
        serviceName: 'Bloqueado',
        clientName: 'Admin',
        createdAt: new Date().toISOString(),
    });

    const barberName = await getBarberName(barberId);

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'block',
        resourceType: 'appointment',
        resourceId: docRef.id,
        resourceName: `Slot bloqueado - ${barberName}`,
        metadata: { date, time, barberId }
    });

    return { success: true };
}

export async function getAdminUsers() {
    await getAdminCheck();

    try {
        const usersSnapshot = await adminDb.collection('users').get();
        const rawUsersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Fetch all users from Firebase Auth to get the most up-to-date profile pictures
        const authUsersResult = await adminAuth.listUsers();
        const authUsers = authUsersResult.users;

        // Deduplication Logic: Group by email to merge legacy UID-based docs and new Email-based docs
        const mergedUsers = new Map<string, any>();

        // 1. First, populate with Auth data
        authUsers.forEach(authUser => {
            const email = authUser.email?.toLowerCase();
            if (!email) return;

            mergedUsers.set(email, {
                id: authUser.uid,
                email: email,
                name: authUser.displayName || 'Cliente',
                avatar: authUser.photoURL || null,
                role: (authUser.customClaims?.role as string) || 'user',
                visitCount: 0,
                lastVisit: null
            });
        });

        // 2. Then, merge/update with Firestore data
        rawUsersData.forEach(user => {
            const email = user.email?.toLowerCase();
            if (!email) return;

            if (!mergedUsers.has(email)) {
                mergedUsers.set(email, { ...user });
            } else {
                const existing = mergedUsers.get(email);
                // Merge logic: Preserve highest visitCount and latest lastVisit
                existing.visitCount = Math.max(existing.visitCount || 0, user.visitCount || 0);
                if (user.lastVisit && (!existing.lastVisit || user.lastVisit > existing.lastVisit)) {
                    existing.lastVisit = user.lastVisit;
                }
                if (user.role === 'admin') existing.role = 'admin';
                if (!existing.name || existing.name === 'Cliente') existing.name = user.name;
                // Prefer Firestore avatar if it exists, otherwise keep Auth one
                if (user.avatar) existing.avatar = user.avatar;
                if (!existing.avatar && user.photoURL) existing.avatar = user.photoURL;
            }
        });

        const now = new Date();

        return Array.from(mergedUsers.values()).map(user => {
            const lastVisitDate = user.lastVisit ? new Date(user.lastVisit) : null;
            let status = 'Nuevo';
            let statusType = 'new';

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
            }

            return {
                id: user.id,
                name: user.name || 'Sin Nombre',
                email: user.email || 'Sin Email',
                avatar: user.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`,
                visitCount: user.visitCount || 0,
                lastVisit: user.lastVisit ? format(parseISO(user.lastVisit), 'dd-MM-yyyy') : 'N/A',
                status,
                statusType,
                role: user.role || 'user'
            };
        });
    } catch (error) {
        console.error('Error getting admin users:', error);
        return [];
    }
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

export async function getServices() {
    try {
        const snapshot = await adminDb.collection('services').get();
        const services = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any[];

        if (services.length === 0) {
            return [];
        }
        return services;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function addService(serviceData: any) {
    const admin = await getAdminCheck();

    if (!serviceData.name || !serviceData.price || !serviceData.duration || !serviceData.category) {
        throw new Error('Todos los campos obligatorios (nombre, precio, duración, categoría) deben estar presentes.');
    }

    // Create service document first to get ID
    const docRef = await adminDb.collection('services').add({
        name: serviceData.name,
        description: serviceData.description || '',
        price: serviceData.price,
        duration: serviceData.duration,
        category: serviceData.category,
        createdAt: new Date().toISOString()
    });

    try {
        let finalImageUrl = serviceData.imageUrl || '';
        // If it's a base64 image, upload to Storage
        if (finalImageUrl.startsWith('data:image')) {
            finalImageUrl = await uploadImageToStorage(
                finalImageUrl,
                `services/${docRef.id}/image.jpg`
            );
        }

        // Update document with final URL
        await docRef.update({ imageUrl: finalImageUrl });

        await createAuditLog({
            adminEmail: admin.email || 'unknown',
            action: 'create',
            resourceType: 'service',
            resourceId: docRef.id,
            resourceName: serviceData.name,
            metadata: { price: serviceData.price, category: serviceData.category }
        });

        revalidatePath('/');
        revalidatePath('/dashboard');
        revalidatePath('/BarberService');

        return { id: docRef.id, success: true };
    } catch (error) {
        // If something fails during image upload, we still have the doc but maybe without image
        // Or we could delete it if we want to be strict (like addBarber does)
        console.error('Error uploading service image:', error);
        return { id: docRef.id, success: true };
    }
}

export async function updateService(id: string, serviceData: any) {
    const admin = await getAdminCheck();

    if (!serviceData.name || !serviceData.price || !serviceData.duration || !serviceData.category) {
        throw new Error('Todos los campos obligatorios (nombre, precio, duración, categoría) deben estar presentes.');
    }

    let finalImageUrl = serviceData.imageUrl || '';
    // If it's a new base64 image, upload to Storage
    if (finalImageUrl.startsWith('data:image')) {
        finalImageUrl = await uploadImageToStorage(
            finalImageUrl,
            `services/${id}/image.jpg`
        );
    }

    await adminDb.collection('services').doc(id).update({
        ...serviceData,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString()
    });

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'update',
        resourceType: 'service',
        resourceId: id,
        resourceName: serviceData.name,
        metadata: { price: serviceData.price, category: serviceData.category }
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/BarberService');

    return { success: true };
}

export async function deleteService(id: string) {
    const admin = await getAdminCheck();

    const serviceDoc = await adminDb.collection('services').doc(id).get();
    const serviceName = serviceDoc.exists ? serviceDoc.data()?.name || 'Unknown' : 'Unknown';

    await adminDb.collection('services').doc(id).delete();

    await createAuditLog({
        adminEmail: admin.email || 'unknown',
        action: 'delete',
        resourceType: 'service',
        resourceId: id,
        resourceName: serviceName
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/BarberService');

    return { success: true };
}

// ============================================
// AUDIT LOGS
// ============================================

export async function getAuditLogs(limit: number = 20, lastTimestamp?: string) {
    await getAdminCheck();

    try {
        let query = adminDb
            .collection('auditLogs')
            .orderBy('timestamp', 'desc')
            .limit(limit);

        if (lastTimestamp) {
            query = query.startAfter(lastTimestamp);
        }

        const snapshot = await query.get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}
