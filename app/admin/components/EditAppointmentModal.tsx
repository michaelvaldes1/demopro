'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Spinner } from "@heroui/react";
import { CheckCircle2, User, Clock, Scissors, AlertCircle, Trash2 } from "lucide-react";
import { updateAppointmentStatus, deleteAppointment } from '../actions';
import { ScheduleItem } from '../types';

interface EditAppointmentModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    appointment: ScheduleItem | null;
    onSuccess: () => void;
}

const STATUS_OPTIONS = [
    { value: 'confirmed', label: 'Confirmada', color: 'success' },
    { value: 'completed', label: 'Completada', color: 'primary' },
    { value: 'cancelled', label: 'Cancelada', color: 'danger' },
    { value: 'no-show', label: 'No Asistió', color: 'warning' },
    { value: 'blocked', label: 'Bloqueado', color: 'default' },
];

export default function EditAppointmentModal({
    isOpen,
    onOpenChange,
    appointment,
    onSuccess
}: EditAppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string>(appointment?.status || 'confirmed');

    // Sync status when appointment changes
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
            alert('Error al actualizar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment || !confirm('¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.')) return;
        setIsLoading(true);
        try {
            await deleteAppointment(appointment.id);
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        } finally {
            setIsLoading(false);
        }
    };

    if (!appointment) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="center"
            hideCloseButton
            classNames={{
                base: "bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden sm:my-8",
                backdrop: "backdrop-blur-xl bg-black/40",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <div className="relative">
                        {/* Glass Refraction Header */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

                        <ModalHeader className="flex flex-col gap-2 items-center justify-center pt-8 pb-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center mb-2 border border-white/10">
                                <Scissors className="text-zinc-400" size={24} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">Gestionar Cita</h2>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: {appointment.id.slice(0, 8)}</p>
                            </div>
                        </ModalHeader>

                        <ModalBody className="p-6 gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoBox
                                    label="Cliente"
                                    value={appointment.clientName || 'N/A'}
                                    icon={<User size={14} />}
                                />
                                <InfoBox
                                    label="Hora"
                                    value={appointment.time}
                                    icon={<Clock size={14} />}
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Servicio</label>
                                <p className="text-sm font-bold text-white">{appointment.service}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{appointment.duration || '45 min'} con {appointment.barberName || 'Barbero'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Estado</label>
                                <Select
                                    selectedKeys={[status]}
                                    onChange={(e) => setStatus(e.target.value)}
                                    classNames={{
                                        trigger: "bg-zinc-900 border-zinc-800",
                                        popoverContent: "bg-zinc-900 border-zinc-800"
                                    }}
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} textValue={opt.label}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full bg-${opt.color}-500`} />
                                                <span>{opt.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </ModalBody>

                        <ModalFooter className="p-6 pt-0 flex flex-col gap-3">
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-primary text-black font-bold"
                                    onPress={handleUpdate}
                                    isLoading={isLoading}
                                >
                                    Guardar Cambios
                                </Button>
                                <Button
                                    isIconOnly
                                    className="bg-red-500/10 text-red-500 border border-red-500/20"
                                    onPress={handleDelete}
                                    isDisabled={isLoading}
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
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

const InfoBox = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-2 mb-1 text-zinc-500">
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
);
