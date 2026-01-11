import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import AdminLayoutClient from "./components/AdminLayoutClient";
import { requireAdmin } from "@/lib/auth";
import { adminAuth } from "@/lib/firebaseAdmin";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side protection
    const session = await requireAdmin();

    // Fetch the full user from Firebase Auth to get the most accurate photoURL
    const userRecord = await adminAuth.getUser(session.uid);

    const userData = {
        name: userRecord.displayName || session.name || 'Admin',
        email: session.email || '',
        picture: userRecord.photoURL || userRecord.providerData?.[0]?.photoURL || `https://ui-avatars.com/api/?name=${userRecord.displayName || 'Admin'}&background=random`,
    };

    return (
        <AdminLayoutClient user={userData}>
            {children}
        </AdminLayoutClient>
    );
}
