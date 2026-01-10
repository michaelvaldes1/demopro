"use client";
import React from "react";
import { Avatar, Button, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { Bell, Trash2, Check } from "lucide-react";
import Profile from "../../profile/components/Profile";
import { subscribeToNotifications, markNotificationAsRead, NotificationData } from "../../lib/firebase/notifications";
import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, ScrollShadow } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function TopBar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (user?.email) {
            const unsubscribe = subscribeToNotifications(user.email, (data) => {
                setNotifications(data);
            });
            return () => unsubscribe();
        }
    }, [user?.email]);

    const handleMarkAsRead = async (id: string, e?: any) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
        await markNotificationAsRead(id);
    };

    const handleNotificationClick = async (notif: NotificationData) => {
        if (!notif.isRead && notif.id) {
            await markNotificationAsRead(notif.id);
        }
        router.push("/profile");
    };

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
                        <Popover placement="bottom-end" backdrop="blur">
                            <PopoverTrigger>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    radius="full"
                                    className="text-zinc-400"
                                >
                                    <Badge
                                        content={unreadCount}
                                        shape="circle"
                                        size="sm"
                                        isInvisible={unreadCount === 0}
                                        classNames={{
                                            badge: "bg-[#D09E1E] text-black border-2 border-zinc-950 text-[10px] font-black h-5 w-5 min-w-[20px] p-0 flex items-center justify-center shadow-[0_0_10px_rgba(208,158,30,0.4)]",
                                        }}
                                    >
                                        <Bell
                                            size={20}
                                            className={unreadCount > 0 ? "text-white" : "text-zinc-500"}
                                            fill={unreadCount > 0 ? "rgba(208,158,30,0.2)" : "transparent"}
                                        />
                                    </Badge>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 border border-white/5 bg-zinc-950/80 backdrop-blur-xl w-[320px]">
                                <div className="p-4 border-b border-white/5 w-full flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Notificaciones</h4>
                                    {unreadCount > 0 && (
                                        <span className="text-[9px] bg-[#D09E1E]/10 text-[#D09E1E] px-2 py-0.5 rounded-full border border-[#D09E1E]/20 font-black uppercase">
                                            {unreadCount} Nuevas
                                        </span>
                                    )}
                                </div>
                                <ScrollShadow className="max-h-[400px] w-full">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <Bell size={32} className="mx-auto text-zinc-800 mb-2" />
                                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Sin notificaciones</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className={`p-4 border-b border-white/5 flex gap-3 group relative transition-colors cursor-pointer hover:bg-white/[0.05] ${!notif.isRead ? 'bg-white/[0.02]' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity ${notif.isRead ? 'opacity-0' : 'bg-[#D09E1E]'}`} />
                                                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                                        <Bell size={14} className={!notif.isRead ? 'text-[#D09E1E]' : 'text-zinc-600'} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-black text-white uppercase tracking-tight leading-tight mb-0.5">
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                    {!notif.isRead && (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            radius="full"
                                                            className="text-zinc-600 hover:text-[#D09E1E] transition-opacity"
                                                            onPress={(e) => handleMarkAsRead(notif.id!, e)}
                                                        >
                                                            <Check size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollShadow>
                            </PopoverContent>
                        </Popover>
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
