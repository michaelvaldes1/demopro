import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side protection
    const session = await requireAdmin();

    const userData = {
        name: session.name || 'Admin',
        email: session.email,
        picture: session.picture,
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans">
            {/* Sidebar fixed */}
            <Sidebar />

            {/* Main content area */}
            <div className="pl-64 flex flex-col min-h-screen">
                <Header user={userData} />

                <main className="flex-1 p-8 bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="py-6 px-8 border-t border-zinc-900 text-center">
                    <p className="text-zinc-600 text-xs">
                        &copy; {new Date().getFullYear()} MiagoBarber Admin Panel. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
}
