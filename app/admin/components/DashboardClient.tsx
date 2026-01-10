'use client';

import React, { useState, useMemo } from 'react';
import { User } from 'lucide-react';
import Stats from './Stats';
import CalendarStrip from './CalendarStrip';
import Timeline from './TimeLine';
import { MOCK_BARBERS } from '@/app/constants/booking';

interface DashboardClientProps {
    stats: {
        revenue: number;
        bookings: number;
        clients: number;
    };
    appointments: any[];
    selectedDate: string;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ stats, appointments, selectedDate }) => {
    const [selectedBarberId, setSelectedBarberId] = useState<string>('all');

    // Filter appointments based on selection
    const filteredAppointments = useMemo(() => {
        if (selectedBarberId === 'all') return appointments;
        return appointments.filter(apt => apt.barberId === selectedBarberId);
    }, [appointments, selectedBarberId]);

    // Recalculate stats based on filtered appointments
    const filteredStats = useMemo(() => {
        if (selectedBarberId === 'all') return stats;

        const bookings = filteredAppointments.length;
        const revenue = filteredAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0);
        // Assuming unique clients based on name/email (simplified)
        const uniqueClients = new Set(filteredAppointments.map(apt => apt.clientName)).size;

        return {
            revenue,
            bookings,
            clients: uniqueClients
        };
    }, [filteredAppointments, stats, selectedBarberId]);

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-6 px-6 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Panel de Control</h1>
                    <p className="text-zinc-500">Resumen de actividad y agenda para hoy.</p>
                </div>

                {/* Barber Filters - Lifted Up */}
                <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl w-fit border border-zinc-800/50 self-start md:self-auto">
                    <button
                        onClick={() => setSelectedBarberId('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${selectedBarberId === 'all'
                            ? 'bg-primary text-black shadow-lg shadow-primary/20'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                            }`}
                    >
                        <User size={14} />
                        Todos
                    </button>
                    {MOCK_BARBERS.map(barber => (
                        <button
                            key={barber.id}
                            onClick={() => setSelectedBarberId(barber.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${selectedBarberId === barber.id
                                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-lg'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`}
                        >
                            <div className="w-2 h-2 rounded-full bg-primary/50" />
                            {barber.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats Section - Now Dynamic */}
            <Stats data={filteredStats} />

            {/* Date Selection Section */}
            <CalendarStrip selectedDate={selectedDate} />

            {/* Schedule Section - Receives filtered appointments */}
            <Timeline
                appointments={filteredAppointments}
                selectedDate={selectedDate}
                selectedBarberId={selectedBarberId}
            />
        </div>
    );
};

export default DashboardClient;
