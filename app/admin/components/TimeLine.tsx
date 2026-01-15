'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ScheduleItem } from '../types';
import { MOCK_TIME_SLOTS } from '@/app/constants/booking';
import { format, parseISO, startOfToday, isBefore, isSameDay, set } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lock, Edit, Scissors, User } from 'lucide-react';
import { blockSlot, deleteAppointment } from '../actions';
import { useRouter } from 'next/navigation';
import EditAppointmentModal from './EditAppointmentModal';
import BlockSlotModal from './BlockSlotModal';
import UnblockSlotModal from './UnblockSlotModal';

interface TimelineProps {
    appointments: any[]; // Usamos any[] para flexibilidad si vienen datos crudos, o ScheduleItem[] si ya están tipados
    selectedDate: string;
    selectedBarberId: string;
    barbers: any[];
}

const Timeline: React.FC<TimelineProps> = ({ appointments, selectedDate, selectedBarberId, barbers }) => {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<ScheduleItem | null>(null);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [slotToBlock, setSlotToBlock] = useState<string | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
    const [appointmentToUnblock, setAppointmentToUnblock] = useState<ScheduleItem | null>(null);
    const [isUnblocking, setIsUnblocking] = useState(false);
    const [currentTimePos, setCurrentTimePos] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Función que faltaba en el código anterior
    const handleSuccess = () => {
        router.refresh();
    };

    // Lógica del indicador de tiempo corregida para evitar errores con elementos hijos
    useEffect(() => {
        const isToday = isSameDay(parseISO(selectedDate), new Date());
        if (!isToday) {
            setCurrentTimePos(null);
            return;
        }

        const updatePosition = () => {
            if (!containerRef.current) return;
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();

            // Seleccionamos solo las filas de tiempo, ignorando el indicador absoluto
            const slotElements = containerRef.current.querySelectorAll('.time-slot-row');
            let currentSlotIdx = -1;

            for (let i = 0; i < MOCK_TIME_SLOTS.length; i++) {
                const [timePart, meridiem] = MOCK_TIME_SLOTS[i].time.split(' ');
                let [h] = timePart.split(':').map(Number);
                if (meridiem === 'PM' && h !== 12) h += 12;
                if (meridiem === 'AM' && h === 12) h = 0;

                if (h === currentHour) {
                    currentSlotIdx = i;
                    break;
                }
            }

            if (currentSlotIdx !== -1 && currentSlotIdx < slotElements.length) {
                const currentSlotEl = slotElements[currentSlotIdx] as HTMLElement;
                const nextSlotEl = slotElements[currentSlotIdx + 1] as HTMLElement;
                const startTop = currentSlotEl.offsetTop;

                if (nextSlotEl) {
                    const diff = nextSlotEl.offsetTop - startTop;
                    setCurrentTimePos(startTop + (diff * (currentMinutes / 60)));
                } else {
                    setCurrentTimePos(startTop + (currentSlotEl.offsetHeight * (currentMinutes / 60)));
                }
            }
        };

        updatePosition();
        const interval = setInterval(updatePosition, 60000);
        return () => clearInterval(interval);
    }, [selectedDate]);

    const confirmBlockSlot = async () => {
        if (!slotToBlock) return;
        setIsBlocking(true);
        try {
            // Si el filtro es 'all', usar el primer barbero disponible desde Firebase
            let barberIdToBlock = selectedBarberId;
            if (selectedBarberId === 'all') {
                if (barbers.length > 0) {
                    barberIdToBlock = barbers[0].id;
                } else {
                    console.error('No hay barberos disponibles');
                    return;
                }
            }
            await blockSlot(selectedDate, slotToBlock, barberIdToBlock);
            handleSuccess();
            setIsBlockModalOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsBlocking(false);
        }
    };

    const confirmUnblockSlot = async () => {
        if (!appointmentToUnblock) return;
        setIsUnblocking(true);
        try {
            await deleteAppointment(appointmentToUnblock.id);
            handleSuccess();
            setIsUnblockModalOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsUnblocking(false);
        }
    };

    const isSlotInPast = (timeStr: string) => {
        const selectedDateObj = parseISO(selectedDate);
        const now = new Date();
        if (isBefore(selectedDateObj, startOfToday())) return true;
        if (isSameDay(selectedDateObj, now)) {
            const [timePart, meridiem] = timeStr.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;

            const slotDate = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
            return isBefore(slotDate, now);
        }
        return false;
    };

    const timelineItems = MOCK_TIME_SLOTS.map(slot => {
        const slotData = appointments.filter(apt => apt.time === slot.time);
        const isPastSlot = isSlotInPast(slot.time);
        return {
            slotId: slot.id,
            time: slot.time,
            isPast: isPastSlot,
            appointments: slotData.map(apt => ({ ...apt, isPast: isPastSlot } as ScheduleItem)),
        };
    });

    const humanDate = format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: es }).toUpperCase();

    return (
        <div className="px-4 md:px-8 mt-10 pb-32">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white tracking-tight">Agenda del Día</h2>
                <div
                    className="px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                >
                    <span className="text-[10px] font-black text-[#E5B454] tracking-[0.2em]">{humanDate}</span>
                </div>
            </div>

            <div ref={containerRef} className="space-y-8 relative">
                {/* Indicador AHORA */}
                {currentTimePos !== null && (
                    <div
                        className="absolute left-0 right-0 z-20 pointer-events-none flex items-center gap-3"
                        style={{ top: `${currentTimePos}px`, transition: 'top 1s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    >
                        <div className="w-16 flex justify-end">
                            <span className="text-[9px] font-black text-[#E5B454] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#E5B454]/30 shadow-2xl">
                                AHORA
                            </span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#E5B454] shadow-[0_0_15px_rgba(229,180,84,0.8)]" />
                            <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#E5B454] to-transparent opacity-40" />
                        </div>
                    </div>
                )}

                {timelineItems.map((slotItem, idx) => (
                    <div
                        key={slotItem.slotId + idx}
                        className={`time-slot-row flex gap-6 transition-all duration-500 ${slotItem.isPast ? 'opacity-30 grayscale-[0.8]' : ''}`}
                    >
                        {/* Columna de Hora */}
                        <div className="w-16 flex flex-col items-center pt-3">
                            <span className={`text-[11px] font-black tracking-tighter ${slotItem.appointments.length === 0 ? 'text-white/20' : 'text-white/80'}`}>
                                {slotItem.time}
                            </span>
                            {idx !== timelineItems.length - 1 && (
                                <div className="w-[1.5px] h-full bg-gradient-to-b from-white/10 to-transparent mt-3 min-h-[60px]" />
                            )}
                        </div>

                        {/* Content Liquid Glass */}
                        <div className="flex-1 flex flex-row gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {slotItem.appointments.length > 0 ? (
                                slotItem.appointments.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative group p-5 rounded-[2.5rem] border transition-all duration-500 min-w-[300px] flex-1"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                            backdropFilter: 'blur(30px) saturate(180%)',
                                            borderColor: item.status === 'blocked' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.12)',
                                            boxShadow: '0 15px 35px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-base truncate max-w-[120px]">{item.clientName}</h4>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${item.status === 'confirmed' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-white/40 border-white/10'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                {item.status !== 'blocked' ? (
                                                    <button
                                                        onClick={() => { setSelectedAppointment(item); setIsEditModalOpen(true); }}
                                                        className="flex items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl border border-white/10 active:scale-90 transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { setAppointmentToUnblock(item); setIsUnblockModalOpen(true); }}
                                                        className="flex items-center justify-center p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 active:scale-90 transition-all"
                                                    >
                                                        <Lock size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                                            <div className="text-[10px] text-white/30 uppercase font-bold tracking-tight">
                                                Servicio: <span className="text-white/80 block text-[11px] mt-0.5 truncate">{item.service}</span>
                                            </div>
                                            <div className="text-[10px] text-white/30 uppercase font-bold tracking-tight">
                                                Barbero: <span className="text-white/80 block text-[11px] mt-0.5 truncate">{item.barberName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    className={`flex flex-1 items-center justify-between h-20 border border-dashed rounded-[2rem] px-6 transition-all duration-300 ${!slotItem.isPast
                                        ? 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                                        : 'border-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/10">
                                            <Scissors size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Disponible</span>
                                    </div>

                                    {!slotItem.isPast && (
                                        <button
                                            onClick={() => { setSlotToBlock(slotItem.time); setIsBlockModalOpen(true); }}
                                            className="flex items-center justify-center p-2.5 bg-white/5 hover:bg-[#D09E1E]/10 text-white/10 hover:text-[#D09E1E] rounded-xl border border-transparent hover:border-[#D09E1E]/20 transition-all"
                                        >
                                            <Lock size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modales unificados */}
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