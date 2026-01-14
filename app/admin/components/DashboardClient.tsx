'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { User, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import CalendarStrip from './CalendarStrip';
import { StatSkeleton, TimelineSkeleton } from './DashboardSkeleton';

interface DashboardClientProps {
    selectedDate: string;
    barbers: any[];
    statsSection: React.ReactNode;
    timelineSection: React.ReactNode;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
    selectedDate,
    barbers,
    statsSection,
    timelineSection
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isDataPending, startDataTransition] = useTransition();

    // Local state to track the selection immediately
    const [activeBarberId, setActiveBarberId] = useState(searchParams.get('barber') || 'all');

    // Sync local state if searchParams change externally (e.g. browser back button)
    useEffect(() => {
        setActiveBarberId(searchParams.get('barber') || 'all');
    }, [searchParams]);

    const handleBarberChange = (id: string) => {
        // 1. Update active state immediately for UI feedback
        setActiveBarberId(id);

        // 2. Perform navigation inside a transition to track it
        startDataTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (id === 'all') {
                params.delete('barber');
            } else {
                params.set('barber', id);
            }
            router.push(`/admin?${params.toString()}`);
        });
    };

    const handleDateChange = (dateStr: string) => {
        // Perform navigation inside a transition to track it
        startDataTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('date', dateStr);
            router.push(`/admin?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="px-4 md:px-8 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">

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
                        onClick={() => router.refresh()}
                        className="group flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 backdrop-blur-md shadow-lg"
                        title="Recargar datos"
                    >
                        <RefreshCw size={18} className={`transition-transform duration-700 ${isDataPending ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                    </button>

                    {/* Filter Capsule */}
                    <div
                        className={`flex-1 min-w-0 overflow-x-auto overflow-y-hidden rounded-full border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] transition-opacity duration-300 ${isDataPending ? 'opacity-80' : 'opacity-100'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
                        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                    >
                        <div className="inline-flex p-1.5 min-w-min">
                            {/* Botón "Todos" */}
                            <button
                                onClick={() => handleBarberChange('all')}
                                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 duration-300 ${activeBarberId === 'all'
                                    ? 'text-black shadow-lg scale-100'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                style={activeBarberId === 'all' ? {
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 4px 12px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                                } : {}}
                            >
                                <User size={14} className={activeBarberId === 'all' ? 'text-black' : 'text-current'} />
                                Todos
                            </button>

                            {/* Separador vertical sutil si hay barberos */}
                            {barbers.length > 0 && <div className="flex-shrink-0 w-px bg-white/5 my-2 mx-1" />}

                            {/* Lista de Barberos */}
                            <div className="flex gap-1">
                                {barbers.map(barber => (
                                    <button
                                        key={barber.id}
                                        onClick={() => handleBarberChange(barber.id)}
                                        className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 duration-300 ${activeBarberId === barber.id
                                            ? 'text-black shadow-lg scale-100'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                            }`}
                                        style={activeBarberId === barber.id ? {
                                            background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                            boxShadow: '0 4px 12px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                                        } : {}}
                                    >
                                        {activeBarberId !== barber.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        )}
                                        {barber.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Selection Section */}
            <CalendarStrip
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            {/* Main Content Sections with Transition Support */}
            <div className="mt-4">
                {isDataPending ? (
                    <div>
                        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 py-6">
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </div>
                        <TimelineSkeleton />
                    </div>
                ) : (
                    <>
                        {statsSection}
                        {timelineSection}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardClient;
