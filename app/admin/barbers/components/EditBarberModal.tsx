'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Scissors } from 'lucide-react';

interface EditBarberModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    barber: any;
    name: string;
    role: string;
    image: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
    onNameChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onImageChange: (value: string) => void;
    onWhatsappChange: (value: string) => void;
    onInstagramChange: (value: string) => void;
    onTiktokChange: (value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (onClose: () => void) => void;
    isSubmitting: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function EditBarberModal({
    isOpen,
    onOpenChange,
    name,
    role,
    image,
    whatsapp,
    instagram,
    tiktok,
    onNameChange,
    onRoleChange,
    onWhatsappChange,
    onInstagramChange,
    onTiktokChange,
    onFileChange,
    onUpdate,
    isSubmitting,
    fileInputRef
}: EditBarberModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            hideCloseButton
            placement="center"
            scrollBehavior="inside"
            motionProps={{
                variants: {
                    enter: {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
                    },
                    exit: {
                        scale: 0.95,
                        y: 10,
                        opacity: 0,
                        transition: { duration: 0.2 }
                    },
                }
            }}
            classNames={{
                base: "max-w-[420px] w-[92%] max-h-[85vh] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]",
                header: "text-white border-none pt-8 px-8",
                body: "gap-4 py-2 px-8 overflow-y-auto custom-scrollbar",
                footer: "border-none pb-8 px-8"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold tracking-tight text-white">Editar Barbero</h2>
                        </ModalHeader>

                        <ModalBody>
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Nombre <span className="text-[#E5B454]">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => onNameChange(e.target.value)}
                                    placeholder="Nombre del barbero"
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#E5B454]/40 transition-all"
                                />
                            </div>

                            {/* Role Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Rol <span className="text-[#E5B454]">*</span></label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => onRoleChange(e.target.value)}
                                    placeholder="Ej. Especialista en cortes clásicos"
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#E5B454]/40 transition-all"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Foto de Perfil <span className="text-[#E5B454]">*</span></label>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-xl flex-shrink-0">
                                        {image ? (
                                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                                <Scissors size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-opacity-90 active:scale-95 transition-all"
                                    >
                                        {image ? 'Cambiar Foto' : 'Subir Foto'}
                                    </button>
                                </div>
                            </div>

                            {/* WhatsApp Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">WhatsApp</label>
                                <input
                                    type="url"
                                    value={whatsapp}
                                    onChange={(e) => onWhatsappChange(e.target.value)}
                                    placeholder="https://wa.me/..."
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#E5B454]/40 transition-all"
                                />
                            </div>

                            {/* Instagram Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Instagram</label>
                                <input
                                    type="url"
                                    value={instagram}
                                    onChange={(e) => onInstagramChange(e.target.value)}
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#E5B454]/40 transition-all"
                                />
                            </div>

                            {/* TikTok Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">TikTok</label>
                                <input
                                    type="url"
                                    value={tiktok}
                                    onChange={(e) => onTiktokChange(e.target.value)}
                                    placeholder="https://tiktok.com/@..."
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#E5B454]/40 transition-all"
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter className="flex gap-3 mt-4 pb-8 px-8">
                            {/* Botón Cancelar - Estilo Cristal Esmerilado */}
                            <Button
                                onPress={onClose}
                                variant="flat"
                                className="flex-1 h-12 rounded-2xl font-semibold text-white/70 hover:text-white transition-all duration-300"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                Cancelar
                            </Button>

                            {/* Botón Actualizar - Estilo Oro Líquido con Relieve */}
                            <Button
                                onPress={() => onUpdate(onClose)}
                                isLoading={isSubmitting}
                                isDisabled={!name || !role || !image}
                                className="flex-[1.5] h-12 rounded-2xl font-bold text-black text-sm transition-all duration-300"
                                style={(!name || !role || !image)
                                    ? {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }
                                    : {
                                        background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                        boxShadow: `
                                            0 10px 20px rgba(208, 158, 30, 0.3),
                                            inset 0 1px 0 rgba(255, 255, 255, 0.4),
                                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                                        `,
                                        border: 'none'
                                    }
                                }
                            >
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
