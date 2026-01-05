"use client";
import React from "react";
import { Avatar, Button, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { Bell } from "lucide-react";
import Profile from "../profile/Profile";

export default function TopBar() {
    const { user, logout } = useAuth();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[60] h-16 bg-zinc-950 border-b border-zinc-900">
                <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Profile Picture (Left) */}
                    <div className="flex-1 flex justify-start">
                        <Dropdown placement="bottom-start">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform w-8 h-8 min-w-8 min-h-8"
                                    color="warning"
                                    name={user?.displayName || "User"}
                                    size="sm"
                                    src={user?.photoURL || undefined}
                                    imgProps={{
                                        referrerPolicy: "no-referrer",
                                        className: "object-cover w-full h-full"
                                    }}
                                />
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Profile Actions"
                                classNames={{
                                    base: "before:bg-transparent p-1 min-w-[200px] bg-transparent"
                                }}
                                style={{
                                    backdropFilter: 'blur(16px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                                }}
                            >
                                <DropdownItem
                                    key="profile"
                                    textValue="Perfil"
                                    className="h-14 gap-2 rounded-t-xl hover:bg-white/10 transition-all duration-200 data-[hover=true]:bg-white/10 m-0"
                                    classNames={{
                                        base: "text-zinc-200 data-[hover=true]:bg-white/10"
                                    }}
                                >
                                    <p className="font-semibold text-white">Conectado como</p>
                                    <p className="font-semibold text-[#D09E1E]">{user?.email}</p>
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    textValue="Mi Perfil"
                                    onPress={onOpen}
                                    className="rounded-none hover:bg-white/10 transition-all duration-200 data-[hover=true]:bg-white/10 text-zinc-200 m-0"
                                >
                                    Mi Perfil
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    textValue="Cerrar Sesión"
                                    color="danger"
                                    onPress={logout}
                                    className="rounded-b-xl hover:bg-red-500/20 transition-all duration-200 data-[hover=true]:bg-red-500/20 text-red-400 m-0"
                                >
                                    Cerrar Sesión
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {/* Logo (Middle - Absolute Centered) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5">
                        <Image src="/miago-single.svg" alt="Logo" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(208,158,30,0.3)]" />
                        <span className="font-bold text-md tracking-tight text-white">MIAGOBARBER</span>
                    </div>

                    {/* Notification (Right) */}
                    <div className="flex-1 flex justify-end">
                        <Badge color="danger" content="3" shape="circle" size="sm">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                className="text-zinc-400"
                            >
                                <Bell size={20} />
                            </Button>
                        </Badge>
                    </div>
                </div>
            </header>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
                classNames={{
                    base: "bg-zinc-950 border border-zinc-800",
                    header: "border-b border-zinc-900",
                    closeButton: "hover:bg-zinc-900",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Mi Perfil</ModalHeader>
                            <ModalBody>
                                <Profile />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
