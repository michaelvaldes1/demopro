'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

interface AdminLayoutClientProps {
    children: React.ReactNode;
    user: {
        name: string;
        email: string;
        picture?: string;
    };
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when navigating to a new page on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Prevent scrolling when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen bg-zinc-950 font-sans">
            {/* Sidebar with toggle state */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Back-drop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content area */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-64'}`}>
                <Header
                    user={user}
                    onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 py-4 md:py-8 bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="py-6 px-4 md:px-8 border-t border-zinc-900 text-center">
                    <p className="text-zinc-600 text-[10px] md:text-xs">
                        &copy; {new Date().getFullYear()} MiagoBarber Admin Panel. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
}
