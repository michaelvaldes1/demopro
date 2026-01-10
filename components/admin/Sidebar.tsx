'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-900 z-50 flex flex-col p-6">
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-black text-sm">MB</div>
                <span className="text-xl font-bold text-zinc-100">MiagoAdmin</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                                }`}>
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

