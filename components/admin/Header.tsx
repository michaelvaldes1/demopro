'use client';

import React from 'react';
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    user?: {
        name?: string;
        email?: string;
        picture?: string;
    };
}

export default function Header({ user }: HeaderProps) {
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
        <header className="h-20 border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div>
                <h2 className="text-zinc-400 text-sm font-medium">Bienvenido de nuevo,</h2>
                <p className="text-zinc-100 font-bold">{user?.name || 'Administrador'}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-zinc-200">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-zinc-500">{user?.email || 'admin@miagobarber.com'}</p>
                </div>

                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform border-[#D09E1E]"
                            size="sm"
                            src={user?.picture}
                            name={user?.name || 'A'}
                        />
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
