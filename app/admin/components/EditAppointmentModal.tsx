'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";
import { User, Clock, Scissors, Trash2, ChevronDown } from "lucide-react";
import { updateAppointmentStatus, deleteAppointment } from '../actions';
import { ScheduleItem } from '../types';

interface EditAppointmentModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    appointment: ScheduleItem | null;
    onSuccess: () => void;
}

const STATUS_OPTIONS = [
    { value: 'confirmed', label: 'Confirmada', color: 'bg-green-500' },
    { value: 'completed', label: 'Completada', color: 'bg-blue-500' },
    { value: 'cancelled', label: 'Cancelada', color: 'bg-red-500' },
    { value: 'no-show', label: 'No Asistió', color: 'bg-yellow-500' },
    { value: 'blocked', label: 'Bloqueado', color: 'bg-zinc-500' },
];

export default function EditAppointmentModal({
    isOpen,
    onOpenChange,
    appointment,
    onSuccess
}: EditAppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string>(appointment?.status || 'confirmed');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    React.useEffect(() => {
        if (appointment) {
            setStatus(appointment.status || 'confirmed');
        }
    }, [appointment]);

    const handleUpdate = async () => {
        if (!appointment) return;
        setIsLoading(true);
        try {
            await updateAppointmentStatus(appointment.id, status);
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment) return;
        setIsLoading(true);
        try {
            await deleteAppointment(appointment.id);
            onSuccess();
            setIsDeleteModalOpen(false);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!appointment) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                placement="center"
                hideCloseButton
                classNames={{
                    base: "max-w-[400px] w-[92%] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden",
                    backdrop: "backdrop-blur-xl bg-black/40",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <div className="relative">
                            <ModalHeader className="flex flex-col gap-3 items-center justify-center pt-10 pb-6">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-black shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                        boxShadow: '0 10px 20px rgba(208, 158, 30, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                                    }}
                                >
                                    <Scissors size={28} />
                                </div>
                                <div className="text-center px-4">
                                    <h2 className="text-xl font-bold text-white tracking-tight">Gestionar Cita</h2>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">ID: {appointment.id.slice(0, 8)}</p>
                                </div>
                            </ModalHeader>

                            <ModalBody className="px-6 gap-5"> {/* Reducido padding lateral del body de 8 a 6 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoBox label="Cliente" value={appointment.clientName || 'N/A'} icon={<User size={14} />} />
                                    <InfoBox label="Hora" value={appointment.time} icon={<Clock size={14} />} />
                                </div>

                                <div className="p-3 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Servicio</label>
                                    <p className="text-sm font-bold text-white">{appointment.service}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{appointment.duration || '45 min'} • {appointment.barberName}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">Estado de la Cita</label>
                                    <Select
                                        selectedKeys={[status]}
                                        onChange={(e) => setStatus(e.target.value)}
                                        variant="flat"
                                        disableSelectorIconRotation
                                        renderValue={(items) => {
                                            const selectedItem = STATUS_OPTIONS.find(opt => opt.value === status);
                                            return (
                                                <div className="flex items-center gap-2">
                                                    {selectedItem && (
                                                        <div className={`w-2 h-2 rounded-full ${selectedItem.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                                    )}
                                                    <span>{items[0].textValue}</span>
                                                </div>
                                            );
                                        }}
                                        selectorIcon={<ChevronDown size={18} className="text-white/50" />}
                                        classNames={{
                                            // Padding horizontal reducido a px-2.5 para más espacio de texto
                                            trigger: "bg-white/5 border border-white/10 rounded-2xl h-12 flex items-center px-2.5",
                                            value: "text-white font-medium text-sm",
                                            innerWrapper: "flex items-center",
                                            selectorIcon: "relative right-1",
                                            popoverContent: "bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl"
                                        }}
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} textValue={opt.label} className="text-white hover:bg-white/10">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${opt.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                                    <span>{opt.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </ModalBody>

                            <ModalFooter className="p-6 pt-2 flex flex-col gap-3">
                                <div className="flex gap-3 w-full">
                                    <Button
                                        isLoading={isLoading}
                                        onPress={handleUpdate}
                                        className="flex-[4] h-12 rounded-2xl font-bold text-black transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                            boxShadow: '0 10px 20px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                        }}
                                    >
                                        Guardar Cambios
                                    </Button>

                                    <Button
                                        isIconOnly
                                        onPress={() => setIsDeleteModalOpen(true)}
                                        isDisabled={isLoading}
                                        className="flex-1 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all backdrop-blur-md flex items-center justify-center"
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </div>

                                <Button
                                    variant="light"
                                    onPress={() => onClose()}
                                    className="w-full text-white/40 font-bold uppercase tracking-widest text-[10px] h-10 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal de Confirmación de Eliminación */}
            <Modal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                backdrop="blur"
                placement="center"
                hideCloseButton
                classNames={{
                    base: "max-w-[340px] w-[90%] bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden",
                    backdrop: "backdrop-blur-md bg-black/60",
                    wrapper: "z-[9999]"
                }}
            >
                <ModalContent>
                    <div className="p-8 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <Trash2 className="text-red-500" size={28} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">¿Eliminar Cita?</h3>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Esta acción no se puede deshacer. La cita de <span className="text-white font-bold">{appointment.clientName}</span> será eliminada permanentemente.
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3 mt-2">
                            <Button
                                isLoading={isLoading}
                                onPress={handleDelete}
                                className="w-full h-12 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Sí, Eliminar
                            </Button>
                            <Button
                                variant="light"
                                onPress={() => setIsDeleteModalOpen(false)}
                                className="w-full h-12 rounded-xl text-white/50 font-bold tracking-widest text-[10px] uppercase hover:text-white transition-colors"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
}

const InfoBox = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="p-2.5 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1 text-white/30">
            {icon}
            <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{label}</span>
        </div>
        <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
);