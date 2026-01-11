'use client';

import React, { useState, useMemo } from 'react';
import { User, RefreshCw } from 'lucide-react';
import Stats from './Stats';
import CalendarStrip from './CalendarStrip';
import Timeline from './TimeLine';

interface DashboardClientProps {
    stats: {
        revenue: number;
        bookings: number;
        clients: number;
    };
    prevStats: {
        revenue: number;
        bookings: number;
        clients: number;
    };
    appointments: any[];
    prevAppointments: any[];
    selectedDate: string;
    barbers: any[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ stats, prevStats, appointments, prevAppointments, selectedDate, barbers }) => {
    const [selectedBarberId, setSelectedBarberId] = useState<string>('all');

    // Filter appointments based on selection
    const filteredAppointments = useMemo(() => {
        if (selectedBarberId === 'all') return appointments;
        return appointments.filter(apt => apt.barberId === selectedBarberId);
    }, [appointments, selectedBarberId]);

    // Recalculate stats based on filtered appointments
    const filteredStats = useMemo(() => {
        let current, prev;

        if (selectedBarberId === 'all') {
            current = stats;
            prev = prevStats;
        } else {
            const activeNow = filteredAppointments.filter(apt => apt.status !== 'blocked');
            const activePrev = prevAppointments.filter(apt => apt.barberId === selectedBarberId && apt.status !== 'blocked');

            current = {
                bookings: activeNow.length,
                revenue: activeNow.reduce((sum, apt) => sum + (apt.price || 0), 0),
                clients: new Set(activeNow.map(apt => apt.clientName)).size
            };

            prev = {
                bookings: activePrev.length,
                revenue: activePrev.reduce((sum, apt) => sum + (apt.price || 0), 0),
                clients: new Set(activePrev.map(apt => apt.clientName)).size
            };
        }

        const calculateTrend = (currVal: number, prevVal: number) => {
            if (prevVal === 0) return { change: currVal > 0 ? '+100%' : '+0%', trend: (currVal > 0 ? 'up' : 'neutral') as 'up' | 'down' | 'neutral' };
            const diff = ((currVal - prevVal) / prevVal) * 100;
            const sign = diff > 0 ? '+' : '';
            return {
                change: `${sign}${diff.toFixed(0)}%`,
                trend: (diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral') as 'up' | 'down' | 'neutral'
            };
        };

        const rev = calculateTrend(current.revenue, prev.revenue);
        const book = calculateTrend(current.bookings, prev.bookings);
        const cli = calculateTrend(current.clients, prev.clients);

        return {
            revenue: current.revenue,
            bookings: current.bookings,
            clients: current.clients,
            revenueChange: rev.change,
            revenueTrend: rev.trend,
            bookingsChange: book.change,
            bookingsTrend: book.trend,
            clientsChange: cli.change,
            clientsTrend: cli.trend
        };
    }, [filteredAppointments, stats, prevStats, prevAppointments, selectedBarberId]);

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-10 px-4 md:px-8 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">

                {/* Títulos con tipografía de alto impacto */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                        Panel de Control
                    </h1>
                    <p className="text-sm font-medium text-white/50 mt-1 uppercase tracking-widest">
                        Resumen de actividad y agenda
                    </p>
                </div>

                {/* Barber Filters - Liquid Capsule */}
                <div className="flex items-center gap-4">

                    {/* Refresh Button - Glass Sphere */}
                    <button
                        onClick={() => window.location.reload()}
                        className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 backdrop-blur-md shadow-lg"
                        title="Recargar datos"
                    >
                        <RefreshCw size={18} className="transition-transform duration-700 group-hover:rotate-180" />
                    </button>

                    {/* Filter Capsule */}
                    <div
                        className="flex p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]"
                        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                    >
                        {/* Botón "Todos" */}
                        <button
                            onClick={() => setSelectedBarberId('all')}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 duration-300 ${selectedBarberId === 'all'
                                    ? 'text-black shadow-lg scale-100'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                            style={selectedBarberId === 'all' ? {
                                background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                boxShadow: '0 4px 12px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                            } : {}}
                        >
                            <User size={14} className={selectedBarberId === 'all' ? 'text-black' : 'text-current'} />
                            Todos
                        </button>

                        {/* Separador vertical sutil si hay barberos */}
                        {barbers.length > 0 && <div className="w-px bg-white/5 my-2 mx-1" />}

                        {/* Lista de Barberos */}
                        <div className="flex gap-1">
                            {barbers.map(barber => (
                                <button
                                    key={barber.id}
                                    onClick={() => setSelectedBarberId(barber.id)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 duration-300 ${selectedBarberId === barber.id
                                            ? 'text-black shadow-lg scale-100'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                    style={selectedBarberId === barber.id ? {
                                        background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                        boxShadow: '0 4px 12px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                                    } : {}}
                                >
                                    {selectedBarberId !== barber.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    )}
                                    {barber.name}
                                </button>
                            ))}
                        </div>
                    </div>
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
