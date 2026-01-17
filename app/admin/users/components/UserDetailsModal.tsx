'use client';

import React from 'react';
import { Modal, ModalContent, ModalBody, Avatar, Button, useDisclosure } from "@heroui/react";
import { Mail, User, ShieldCheck, X, Calendar, Clock, Scissors, MapPin } from "lucide-react";
import AppointmentHistory from "@/app/profile/components/AppointmentHistory";

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        visitCount: number;
        lastVisit: string;
        status: string;
        statusType: string;
        role: string;
    } | null;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            placement="center"
            scrollBehavior="inside"
            className="bg-zinc-950/20 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden"
            backdrop="blur"
            hideCloseButton
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: 20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <ModalBody className="p-0">
                        <div className="relative max-h-[85vh] overflow-y-auto no-scrollbar pt-12 pb-6 px-6 flex flex-col gap-4">
                            {/* Close Button - Fixed relative to container */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-[1010] p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                            >
                                <X size={16} />
                            </button>

                            {/* Refraction Line */}
                            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                            {/* Header / Avatar Section */}
                            <div className="flex flex-col items-center text-center relative">
                                <div className="absolute top-0 w-24 h-24 bg-[#E5B454]/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative p-1 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent mb-2 shadow-xl">
                                    <Avatar
                                        src={user.avatar || (user as any).photoURL || undefined}
                                        name={(user.name || (user as any).displayName || "Usuario").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                        className="w-20 h-20 text-large"
                                        isBordered
                                        imgProps={{
                                            referrerPolicy: "no-referrer",
                                            className: "object-cover"
                                        }}
                                        classNames={{
                                            base: "bg-zinc-900 ring-2 ring-[#E5B454]/50",
                                            name: "text-[#E5B454] font-bold"
                                        }}
                                    />
                                    {user.role === 'admin' && (
                                        <div className="absolute bottom-0 right-0 bg-[#E5B454] text-black p-0.5 rounded-full border-2 border-[#09090b] shadow-lg">
                                            <ShieldCheck size={10} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight drop-shadow-md">
                                        {user.name}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.statusType === 'frequent' ? 'bg-green-500' :
                                            user.statusType === 'active' ? 'bg-[#E5B454]' : 'bg-zinc-500'
                                            }`} />
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{user.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
                                    <span className="text-xl font-black text-[#E5B454]">{user.visitCount}</span>
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Visitas Totales</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center overflow-hidden">
                                    <span className="text-sm font-bold text-white mb-0.5 truncate w-full">{user.lastVisit}</span>
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Última Visita</span>
                                </div>
                            </div>

                            {/* Info Tiles */}
                            <div className="grid gap-2">
                                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-[#E5B454] border border-white/5 shadow-inner flex-shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Email</span>
                                        <span className="text-sm font-bold text-white truncate">{user.email}</span>
                                    </div>
                                </div>

                                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-[#E5B454] border border-white/5 shadow-inner flex-shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Rol de Usuario</span>
                                        <span className="text-sm font-bold text-white uppercase">{user.role}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider visual */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* History Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Historial de Citas</h4>
                                </div>
                                <div className="max-h-[180px] overflow-y-auto no-scrollbar pr-1">
                                    <AppointmentHistory email={user.email} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-1">
                                <p className="text-[9px] text-white/10 italic text-center uppercase font-bold tracking-[0.2em]">
                                    Información del Cliente - MiagoBarber Admin
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
}
