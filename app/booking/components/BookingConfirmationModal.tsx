"use client";

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { CheckCircle2, Calendar, Clock, User, Scissors, Mail } from "lucide-react";
import { Service } from './types';

interface BookingConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => Promise<void>;
    bookingData: {
        services: Service[];
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
            placement="center"
            hideCloseButton
            classNames={{
                // Base del modal estilo iOS 26: Bordes muy redondeados, fondo oscuro translúcido, sombra profunda
                base: "max-w-[400px] w-[90%] mx-auto bg-[#09090b]/80 backdrop-blur-[50px] border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)]",
                backdrop: "bg-black/60 backdrop-blur-md",
                wrapper: "z-[200]"
            }}
        >
            <ModalContent className="p-0 overflow-hidden">
                {(onClose) => (
                    <div className="relative flex flex-col w-full h-full">

                        {/* 1. Refraction Line (Luz superior) */}
                        <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                        {/* Header */}
                        <ModalHeader className="flex flex-col gap-4 items-center justify-center pt-10 pb-2 bg-transparent">
                            {/* Icono Flotante con Glow */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-[#E5B454]/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                                    <Scissors className="text-[#E5B454] drop-shadow-[0_2px_10px_rgba(229,180,84,0.5)]" size={32} />
                                </div>
                            </div>
                            <div className="text-center space-y-1 z-10">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Confirmar</h2>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Resumen de tu cita</p>
                            </div>
                        </ModalHeader>

                        {/* Body - Scrollable */}
                        <ModalBody className="px-6 py-4 gap-4 overflow-y-auto custom-scrollbar">

                            {/* Tarjetas de Servicios Seleccionados */}
                            <div className="space-y-3">
                                <span className="text-[9px] font-black text-[#E5B454] uppercase tracking-[0.2em] ml-2">Servicios Seleccionados</span>
                                {bookingData.services.map((service, idx) => (
                                    <div key={idx} className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 flex flex-col gap-1 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#E5B454]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <h3 className="text-sm font-bold text-white leading-tight">{service.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-white/60 text-[11px] font-bold font-mono">
                                                ${service.price}
                                            </span>
                                            <span className="text-white/30 text-[11px] font-bold flex items-center gap-1">
                                                <Clock size={10} /> {service.duration} min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total (si hay más de uno) */}
                            {bookingData.services.length > 1 && (
                                <div className="px-6 py-3 rounded-2xl bg-[#E5B454]/10 border border-[#E5B454]/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#E5B454] uppercase tracking-widest">Total Estimado</span>
                                    <span className="text-lg font-black text-white">
                                        ${bookingData.services.reduce((sum, s) => sum + s.price, 0)}
                                    </span>
                                </div>
                            )}

                            {/* Grid de Detalles (Barbero, Fecha, Hora) */}
                            <div className="grid grid-cols-2 gap-3">
                                <InfoTile
                                    icon={<User size={16} />}
                                    label="Barbero"
                                    value={bookingData.barberName}
                                />
                                <InfoTile
                                    icon={<Calendar size={16} />}
                                    label="Fecha"
                                    value={bookingData.date}
                                />
                                <InfoTile
                                    icon={<Clock size={16} />}
                                    label="Hora"
                                    value={bookingData.time}
                                    className="col-span-2 flex-row items-center gap-4 px-5"
                                />
                            </div>

                            {/* Info Cliente */}
                            <div className="p-4 rounded-[1.5rem] bg-black/20 border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                    <Mail size={16} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Cliente</span>
                                    <span className="text-sm font-bold text-white truncate">{bookingData.clientName}</span>
                                    <span className="text-xs text-white/50 truncate">{bookingData.clientEmail}</span>
                                </div>
                            </div>

                        </ModalBody>

                        {/* Footer */}
                        <ModalFooter className="p-6 pt-2 flex flex-col gap-3 bg-transparent">
                            {isSuccess ? (
                                <div className="w-full flex flex-col items-center gap-6 py-4 animate-in fade-in zoom-in duration-300">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]">
                                        <CheckCircle2 className="text-green-400" size={40} />
                                    </div>
                                    <p className="text-green-400 font-bold uppercase tracking-widest text-xs">¡Agendado con éxito!</p>
                                    <Button
                                        className="w-full h-14 rounded-[1.5rem] bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 border border-white/5 transition-all"
                                        onPress={() => onOpenChange(false)}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {(!bookingData.clientEmail || bookingData.clientEmail === "N/A") && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex justify-center mb-2">
                                            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Inicia sesión para agendar</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 w-full">
                                        <Button
                                            variant="flat"
                                            className="flex-1 h-14 rounded-[1.5rem] bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-bold uppercase tracking-wider text-[10px] transition-colors"
                                            onPress={() => onOpenChange(false)}
                                            isDisabled={isSaving}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            className="flex-[2] h-14 rounded-[1.5rem] font-black text-black uppercase tracking-tight text-sm shadow-[0_10px_30px_-5px_rgba(208,158,30,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(208,158,30,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:transform-none"
                                            style={{
                                                background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                            }}
                                            onPress={onConfirm}
                                            isDisabled={isSaving || !bookingData.clientEmail || bookingData.clientEmail === "N/A"}
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center gap-3">
                                                    <Spinner size="sm" color="current" />
                                                    <span>Procesando</span>
                                                </div>
                                            ) : (
                                                "Confirmar Cita"
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </ModalFooter>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}

// Sub-componente para las "burbujas" de información
const InfoTile = ({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: string, className?: string }) => (
    <div className={`p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-center items-start gap-2 hover:bg-white/[0.06] transition-colors ${className}`}>
        <div className="text-[#E5B454] opacity-80">
            {icon}
        </div>
        <div>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-white leading-tight mt-0.5">{value}</p>
        </div>
    </div>
);