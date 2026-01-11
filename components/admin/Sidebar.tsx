'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, X, Scissors, LogOut, Home } from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Barberos', href: '/admin/barbers', icon: Scissors },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <>
            {/* Backdrop con desenfoque dinámico */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500"
                />
            )}

            {/* Sidebar Liquid Glass */}
            <aside
                className={`fixed left-4 top-4 bottom-4 w-64 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 rounded-[2.5rem] overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'
                    }`}
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    backdropFilter: 'blur(40px) saturate(200%) brightness(100%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: `
                        0 20px 50px rgba(0, 0, 0, 0.3),
                        inset 0 0 20px rgba(255, 255, 255, 0.05),
                        inset 0 1px 1px rgba(255, 255, 255, 0.3)
                    `,
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Header con brillo superior */}
                    <div className="px-6 py-8 relative">
                        <div className="flex items-center gap-3 relative z-10">
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-black text-sm relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 8px 16px rgba(208, 158, 30, 0.4)',
                                }}
                            >
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 skew-y-[-15deg] -translate-y-2" />
                                MB
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">MiagoAdmin</span>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-8 lg:hidden text-white/70 hover:text-white p-2 rounded-full transition-all bg-white/10 z-20"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Navigation con items "Liquid" */}
                    <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => onClose?.()}
                                    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
                                        }`}
                                    style={isActive ? {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 10px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    } : {}}
                                >
                                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <Icon size={20} color={isActive ? "#E5B454" : "currentColor"} />
                                    </div>
                                    <span className="font-medium text-[15px]">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 w-1.5 h-6 bg-[#E5B454] rounded-full blur-[2px]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions - Sección Flotante */}
                    <div className="p-4 mt-auto space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5"
                        >
                            <Home size={18} />
                            <span className="font-medium text-sm">Vista cliente</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-300 hover:text-red-100 transition-all bg-red-500/10 hover:bg-red-500/20 border border-red-500/10"
                        >
                            <LogOut size={18} />
                            <span className="font-medium text-sm">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}