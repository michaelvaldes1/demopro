'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Lock } from "lucide-react";

interface BlockSlotModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
    slotTime: string | null;
    isLoading: boolean;
}

export default function BlockSlotModal({
    isOpen,
    onOpenChange,
    onConfirm,
    slotTime,
    isLoading
}: BlockSlotModalProps) {
    if (!slotTime) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="center"
            hideCloseButton
            classNames={{
                // Contenedor Liquid Glass centrado y compacto
                base: "max-w-[360px] w-[90%] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden",
                backdrop: "backdrop-blur-xl bg-black/40",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <div className="relative">
                        {/* Brillo de refracción superior típico de iOS 26 */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                        <ModalHeader className="flex flex-col gap-3 items-center justify-center pt-10 pb-4">
                            {/* Icono con relieve físico (Liquid Gold) */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-black shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 10px 20px rgba(208, 158, 30, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                <Lock size={28} />
                            </div>
                            <div className="text-center px-4">
                                <h2 className="text-xl font-bold text-white tracking-tight">Bloquear Horario</h2>
                                <div className="mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-block">
                                    <p className="text-[11px] text-[#E5B454] font-black uppercase tracking-[0.15em]">
                                        {slotTime}
                                    </p>
                                </div>
                            </div>
                        </ModalHeader>

                        <ModalBody className="px-7 py-2 text-center">
                            <p className="text-sm text-white/50 leading-relaxed">
                                ¿Estás seguro de que deseas bloquear este horario? Los clientes <span className="text-white/80 font-semibold">no podrán agendar</span> citas en esta hora.
                            </p>
                        </ModalBody>

                        <ModalFooter className="p-7 flex flex-col gap-3">
                            <Button
                                onPress={onConfirm}
                                isLoading={isLoading}
                                className="w-full h-12 rounded-2xl font-bold text-black transition-all duration-300 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 10px 20px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                }}
                            >
                                Confirmar Bloqueo
                            </Button>

                            <Button
                                variant="light"
                                onPress={() => onClose()}
                                className="w-full text-white/30 font-bold uppercase tracking-widest text-[10px] h-10 hover:text-white transition-colors"
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}