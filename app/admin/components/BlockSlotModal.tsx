'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Lock, AlertCircle } from "lucide-react";

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
                base: "bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden sm:my-8 max-w-sm",
                backdrop: "backdrop-blur-xl bg-black/40",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <div className="relative">
                        {/* Glass Refraction Header */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

                        <ModalHeader className="flex flex-col gap-2 items-center justify-center pt-8 pb-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/20">
                                <Lock className="text-primary" size={24} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">Bloquear Horario</h2>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                    {slotTime}
                                </p>
                            </div>
                        </ModalHeader>

                        <ModalBody className="p-6 text-center">
                            <p className="text-sm text-zinc-400">
                                ¿Estás seguro de que deseas bloquear este horario? Los clientes no podrán agendar citas en esta hora.
                            </p>
                        </ModalBody>

                        <ModalFooter className="p-6 pt-0 flex flex-col gap-3">
                            <Button
                                className="w-full bg-primary text-black font-bold"
                                onPress={onConfirm}
                                isLoading={isLoading}
                            >
                                Confirmar Bloqueo
                            </Button>
                            <Button
                                variant="light"
                                className="w-full text-zinc-500 font-bold uppercase tracking-widest text-xs h-8"
                                onPress={() => onClose()}
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
