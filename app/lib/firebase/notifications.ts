import { db } from "./clients";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    orderBy,
    limit
} from "firebase/firestore";

export interface NotificationData {
    id?: string;
    userId: string; // client email
    title: string;
    message: string;
    isRead: boolean;
    createdAt?: any;
}

export const createNotification = async (data: Omit<NotificationData, 'id' | 'createdAt'>) => {
    try {
        await addDoc(collection(db, "notifications"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error };
    }
};

export const subscribeToNotifications = (email: string, callback: (notifications: NotificationData[]) => void) => {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", email),
        orderBy("createdAt", "desc"),
        limit(20)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as NotificationData[];
        callback(notifications);
    });
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const docRef = doc(db, "notifications", notificationId);
        await updateDoc(docRef, { isRead: true });
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false, error };
    }
};
