import React, { Suspense } from 'react';
import TopBar from '../components/shared/TopBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import BookingClient from './components/BookingClient';
import DashboardWrapper from '../dashboard/components/DashboardWrapper';
import { getBarbers, getServices } from '../admin/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reservar Cita | MiagoBarber',
    description: 'Reserva tu cita en línea en MiagoBarber. Elige a tu barbero favorito y el servicio que prefieras.',
    keywords: 'reservar cita, barbería, agendar cita, miagobarber',
};

interface BookingPageProps {
    searchParams: Promise<{ serviceId?: string; barberId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
    const { serviceId, barberId } = await searchParams;

    // Fetch data server-side
    const [allBarbers, services] = await Promise.all([
        getBarbers(),
        getServices()
    ]);

    // Filter active barbers only
    const barbers = allBarbers.filter(b => b.isAvailable !== false);

    return (
        <DashboardWrapper>
            <div className="min-h-screen bg-background text-white pb-32 max-w-2xl mx-auto shadow-2xl overflow-hidden relative pt-16">
                <TopBar />

                <Suspense fallback={<div className="flex h-[50vh] items-center justify-center text-zinc-500 font-bold animate-pulse">Cargando sistema de reservas...</div>}>
                    <BookingClient
                        initialBarbers={barbers}
                        initialServices={services}
                        barberIdParam={barberId || null}
                        serviceIdParam={serviceId || null}
                    />
                </Suspense>

                <div className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 z-40">
                    <BottomNavBar />
                </div>
            </div>
        </DashboardWrapper>
    );
}
