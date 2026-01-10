"use client";

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { CheckCircle2, Calendar, Clock, User, Scissors, X } from "lucide-react";
import { Service } from './types';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => Promise<void>;
    bookingData: {
        service: Service;
        barberName: string;
        date: string;
        time: string;
        clientName: string;
        clientEmail: string;
    };
    isSaving: boolean;
    isSuccess: boolean;
}

export default function BookingConfirmationModal({
    isOpen,
    onOpenChange,
    onConfirm,
    bookingData,
    isSaving,
    isSuccess
}: BookingConfirmationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="top"
            hideCloseButton
            classNames={{
                base: "bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden p-0 mt-20",
                backdrop: "backdrop-blur-xl bg-black/40",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <div className="relative">
                        {/* Glass Refraction Header */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

                        <ModalHeader className="flex flex-col gap-2 items-center justify-center pt-10 pb-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="w-16 h-16 rounded-full bg-[#D09E1E]/20 flex items-center justify-center mb-2 border border-[#D09E1E]/30">
                                <Scissors className="text-[#D09E1E]" size={32} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Confirmar Cita</h2>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Revisa los detalles antes de agendar</p>
                            </div>
                        </ModalHeader>

                        <ModalBody className="p-8 gap-6">
                            <div className="space-y-4">
                                <InfoRow
                                    icon={<Scissors size={18} />}
                                    label="Servicio"
                                    value={bookingData.service.name}
                                    subValue={`${bookingData.service.duration} min • $${bookingData.service.price}`}
                                />
                                <InfoRow
                                    icon={<User size={18} />}
                                    label="Barbero"
                                    value={bookingData.barberName}
                                />
                                <InfoRow
                                    icon={<Calendar size={18} />}
                                    label="Fecha"
                                    value={bookingData.date}
                                />
                                <InfoRow
                                    icon={<Clock size={18} />}
                                    label="Hora"
                                    value={bookingData.time}
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Información del Cliente</p>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{bookingData.clientName}</span>
                                    <span className="text-xs text-zinc-400">{bookingData.clientEmail}</span>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter className="p-8 pt-0 flex flex-col gap-3">
                            {isSuccess ? (
                                <div className="w-full flex flex-col items-center gap-4 py-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                        <CheckCircle2 className="text-green-500" size={32} />
                                    </div>
                                    <p className="text-green-500 font-bold uppercase tracking-widest text-xs">¡Cita agendada con éxito!</p>
                                    <Button
                                        className="w-full h-12 bg-white/10 text-white font-bold uppercase tracking-widest text-xs"
                                        onPress={() => onOpenChange(false)}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {!bookingData.clientEmail || bookingData.clientEmail === "N/A" ? (
                                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
                                            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">Debes iniciar sesión para agendar</p>
                                        </div>
                                    ) : null}
                                    <Button
                                        className="w-full h-14 bg-[#D09E1E] text-black font-black uppercase tracking-tight text-lg shadow-[0_20px_40px_rgba(208,158,30,0.2)] active:scale-95 transition-all"
                                        onPress={onConfirm}
                                        isDisabled={isSaving || !bookingData.clientEmail || bookingData.clientEmail === "N/A"}
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center gap-3">
                                                <Spinner size="sm" color="current" />
                                                <span>Procesando...</span>
                                            </div>
                                        ) : (
                                            "Confirmar y Agendar"
                                        )}
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="w-full text-zinc-500 font-bold uppercase tracking-widest text-xs h-10"
                                        onPress={() => onOpenChange(false)}
                                        isDisabled={isSaving}
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            )}
                        </ModalFooter>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}

const InfoRow = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[#D09E1E]">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">{label}</span>
            <span className="text-md font-black text-white leading-tight uppercase tracking-tight">{value}</span>
            {subValue && <span className="text-[11px] text-zinc-400 font-medium mt-0.5">{subValue}</span>}
        </div>
    </div>
);
