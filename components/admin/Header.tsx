'use client';

import React from 'react';
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

interface HeaderProps {
    onMenuToggle?: () => void;
    user?: {
        name?: string;
        email?: string;
        picture?: string;
    };
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call the logout API route
            await fetch('/api/auth/logout', { method: 'POST' });

            // Redirect to login
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="h-20 border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-4">
                {/* Hamburger menu for mobile */}
                <Button
                    isIconOnly
                    variant="light"
                    className="lg:hidden text-zinc-400"
                    onClick={onMenuToggle}
                >
                    <Menu size={20} />
                </Button>

                <div>
                    <h2 className="text-zinc-400 text-[10px] md:text-sm font-medium">Bienvenido de nuevo,</h2>
                    <p className="text-zinc-100 font-bold text-sm md:text-base">{user?.name || 'Administrador'}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-zinc-200">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-zinc-500">{user?.email || 'admin@miagobarber.com'}</p>
                </div>

                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <button className="relative group outline-none">
                            <div className="w-10 h-10 rounded-full border-2 border-[#D09E1E] overflow-hidden transition-transform group-hover:scale-105">
                                {user?.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name || 'Admin'}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`w-full h-full bg-primary/20 flex items-center justify-center ${user?.picture ? 'hidden' : ''}`}>
                                    <span className="text-primary font-bold text-sm">{(user?.name || 'A').charAt(0)}</span>
                                </div>
                            </div>
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Acciones de usuario" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold text-zinc-400">Firmado como</p>
                            <p className="font-semibold text-zinc-100">{user?.email || 'admin'}</p>
                        </DropdownItem>
                        <DropdownItem key="settings">Configuración</DropdownItem>
                        <DropdownItem
                            key="logout"
                            color="danger"
                            className="text-danger"
                            onPress={handleLogout}
                        >
                            Cerrar Sesión
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </header>
    );
}
