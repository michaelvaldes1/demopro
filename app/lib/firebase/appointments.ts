import { db } from "./clients";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export interface AppointmentData {
    serviceId: string;
    serviceName: string;
    date: string; // YYYY-MM-DD
    time: string;
    barberId: string;
    barberName: string;
    clientName: string;
    clientEmail: string;
    status: 'confirmed' | 'cancelled' | 'rejected' | 'completed' | 'blocked';
}

export const saveAppointment = async (data: AppointmentData) => {
    try {
        const docRef = await addDoc(collection(db, "appointments"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving appointment:", error);
        return { success: false, error };
    }
};

export const getBookedSlots = async (barberId: string, date: string) => {
    try {
        const q = query(
            collection(db, "appointments"),
            where("barberId", "==", barberId),
            where("date", "==", date),
            where("status", "==", "confirmed")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data().time);
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        return [];
    }
};

export const getUserAppointments = async (email: string) => {
    try {
        const q = query(
            collection(db, "appointments"),
            where("clientEmail", "==", email.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (AppointmentData & { id: string, status: string })[];
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        return [];
    }
};
