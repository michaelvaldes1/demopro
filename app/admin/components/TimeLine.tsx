'use client';
import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { MOCK_BARBERS, MOCK_TIME_SLOTS } from '@/app/constants/booking';
import { format, parseISO, isPast, set, startOfToday, isBefore, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lock, Edit, Plus, Trash2, User } from 'lucide-react';
import { blockSlot } from '../actions';
import { useRouter } from 'next/navigation';
import EditAppointmentModal from './EditAppointmentModal';
import BlockSlotModal from './BlockSlotModal';
import UnblockSlotModal from './UnblockSlotModal';
import { deleteAppointment } from '../actions';

interface TimelineProps {
    appointments: any[];
    selectedDate: string;
    selectedBarberId: string;
}

const Timeline: React.FC<TimelineProps> = ({ appointments, selectedDate, selectedBarberId }) => {
    const router = useRouter();
    // selectedBarberId is now a prop
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<ScheduleItem | null>(null);

    // Block Modal State
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [slotToBlock, setSlotToBlock] = useState<string | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);

    // Unblock Modal State
    const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
    const [appointmentToUnblock, setAppointmentToUnblock] = useState<ScheduleItem | null>(null);
    const [isUnblocking, setIsUnblocking] = useState(false);

    const handleBlockSlot = (time: string) => {
        setSlotToBlock(time);
        setIsBlockModalOpen(true);
    };

    const confirmBlockSlot = async () => {
        if (!slotToBlock) return;

        setIsBlocking(true);
        try {
            // If specific barber is selected, block for that barber. Otherwise default behavior (maybe 'b1' or global block?)
            // For now, if "All" is selected, we might default to the first barber or handle it in backend.
            // The user request implies admin can manage specific barber schedules.
            // Let's pass the selectedBarberId if it's not 'all', otherwise maybe default to 'b1' or require selection?
            // Existing backend `blockSlot` defaults to 'b1'.
            const barberIdToBlock = selectedBarberId === 'all' ? 'b1' : selectedBarberId;
            await blockSlot(selectedDate, slotToBlock, barberIdToBlock);
            router.refresh();
            setIsBlockModalOpen(false);
            setSlotToBlock(null);
        } catch (e) {
            console.error(e);
            alert('Error al bloquear slot');
        } finally {
            setIsBlocking(false);
        }
    };

    const handleUnblockSlot = (appointment: ScheduleItem) => {
        setAppointmentToUnblock(appointment);
        setIsUnblockModalOpen(true);
    };

    const confirmUnblockSlot = async () => {
        if (!appointmentToUnblock) return;

        setIsUnblocking(true);
        try {
            await deleteAppointment(appointmentToUnblock.id);
            router.refresh();
            setIsUnblockModalOpen(false);
            setAppointmentToUnblock(null);
        } catch (e) {
            console.error(e);
            alert('Error al bloquear slot');
        } finally {
            setIsUnblocking(false);
        }
    };

    const handleEditAppointment = (appointment: ScheduleItem) => {
        setSelectedAppointment(appointment);
        setIsEditModalOpen(true);
    };

    const handleSuccess = () => {
        router.refresh();
    };

    // Helper to check if a specific time string (09:00 AM) on the selected date is in the past
    const isSlotInPast = (timeStr: string) => {
        const selectedDateObj = parseISO(selectedDate);
        const now = new Date();

        // If selected date is in the past (yesterday etc), all slots are past
        if (isBefore(selectedDateObj, startOfToday())) return true;

        // If selected date is TODAY, we need to compare times
        if (isSameDay(selectedDateObj, now)) {
            const [timePart, meridiem] = timeStr.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);

            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;

            const slotDate = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
            return isBefore(slotDate, now);
        }

        // Future dates
        return false;
    };


    // Appointments are already filtered from parent
    const appointmentMap = new Map(appointments.map(apt => [apt.time, apt]));

    const timelineItems = MOCK_TIME_SLOTS.map(slot => {
        // Find ALL appointments for this time slot
        const slotData = appointments.filter(apt => apt.time === slot.time);
        const isPastSlot = isSlotInPast(slot.time);

        return {
            slotId: slot.id,
            time: slot.time,
            isPast: isPastSlot,
            appointments: slotData.map(apt => ({
                ...apt,
                type: 'appointment',
                icon: 'content_cut',
                isPast: isPastSlot
            } as ScheduleItem)),
            availableItem: {
                id: slot.id,
                time: slot.time,
                type: 'available',
                isPast: isPastSlot
            } as ScheduleItem
        };
    });

    const humanDate = format(parseISO(selectedDate), 'MMM d, yyyy', { locale: es }).toUpperCase();

    return (
        <div className="px-6 mt-8 pb-32">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Agenda del Día</h2>
                    <div className="px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700">
                        <span className="text-[10px] font-bold text-primary tracking-widest">{humanDate}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6 relative">
                {timelineItems.map((slotItem, idx) => (
                    <div key={slotItem.slotId + idx} className={`relative flex gap-4 ${slotItem.isPast ? 'opacity-50 grayscale' : ''}`}>

                        {/* Time Column */}
                        <div className="w-16 flex flex-col items-center pt-2">
                            <span className={`text-xs font-bold ${slotItem.appointments.length === 0 ? 'text-slate-500' : 'text-white'}`}>
                                {slotItem.time}
                            </span>
                            {/* Vertical Line Connector (optional/visual) */}
                            {idx !== timelineItems.length - 1 && (
                                <div className="w-[1px] h-full bg-slate-800/50 mt-2 min-h-[40px]"></div>
                            )}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 flex flex-row gap-3 overflow-x-auto pb-2">
                            {slotItem.appointments.length > 0 ? (
                                slotItem.appointments.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative group p-4 rounded-2xl border transition-all min-w-[280px] flex-1 ${item.status === 'blocked'
                                            ? 'bg-red-900/10 border-red-500/20 text-red-400'
                                            : item.status === 'confirmed'
                                                ? 'bg-primary/10 border-primary/20 text-white'
                                                : 'bg-card-dark border-slate-800/50 text-white'
                                            }`}
                                    >
                                        {/* Edit Button (Only if not past) */}
                                        {!item.isPast && item.status !== 'blocked' && (
                                            <button
                                                onClick={() => handleEditAppointment(item)}
                                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        )}

                                        {/* Unblock Button (Only if blocked and not past) */}
                                        {!item.isPast && item.status === 'blocked' && (
                                            <button
                                                onClick={() => handleUnblockSlot(item)}
                                                className="absolute top-4 right-4 p-2 text-primary hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
                                                title="Desbloquear horario"
                                            >
                                                <Lock size={14} className="opacity-50" />
                                            </button>
                                        )}

                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-base line-clamp-1">{item.clientName}</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-400">Servicio:</span>
                                                <span className="text-sm font-medium">{item.service}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-400">Barbero:</span>
                                                <span className="text-sm font-medium">{item.barberName || 'Sin asignar'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-700/30">
                                                <span className="text-[10px] uppercase tracking-wide text-zinc-500">{item.duration || '45 min'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`flex items-center justify-between h-14 border border-dashed border-slate-800/30 rounded-2xl px-4 text-slate-600 bg-zinc-900/20 transition-all ${!slotItem.isPast ? 'hover:border-slate-700 hover:bg-zinc-800/30' : ''}`}>
                                    <span className="text-xs font-medium">Disponible</span>

                                    {!slotItem.isPast && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleBlockSlot(slotItem.time)}
                                                className="p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-lg transition-colors"
                                                title="Bloquear horario"
                                            >
                                                <Lock size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <EditAppointmentModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                appointment={selectedAppointment}
                onSuccess={handleSuccess}
            />

            <BlockSlotModal
                isOpen={isBlockModalOpen}
                onOpenChange={setIsBlockModalOpen}
                slotTime={slotToBlock}
                onConfirm={confirmBlockSlot}
                isLoading={isBlocking}
            />

            <UnblockSlotModal
                isOpen={isUnblockModalOpen}
                onOpenChange={setIsUnblockModalOpen}
                slotTime={appointmentToUnblock?.time || null}
                onConfirm={confirmUnblockSlot}
                isLoading={isUnblocking}
            />
        </div>
    );
};

export default Timeline;
