import React from 'react';
import { getDashboardData } from '../actions';
import Stats from './Stats';

interface StatsContainerProps {
    date: string;
    barberId: string;
}

export default async function StatsContainer({ date, barberId }: StatsContainerProps) {
    const data = await getDashboardData(date);
    const { stats, prevStats, appointments, prevAppointments } = data;

    // Filter and recalculate if a specific barber is selected
    let current, prev;

    if (barberId === 'all') {
        current = stats;
        prev = prevStats;
    } else {
        const activeNow = appointments.filter((apt: any) => apt.barberId === barberId && apt.status !== 'blocked');
        const activePrev = prevAppointments.filter((apt: any) => apt.barberId === barberId && apt.status !== 'blocked');

        current = {
            bookings: activeNow.length,
            revenue: activeNow.reduce((sum: number, apt: any) => sum + (apt.price || 0), 0),
            clients: new Set(activeNow.map((apt: any) => apt.clientName)).size
        };

        prev = {
            bookings: activePrev.length,
            revenue: activePrev.reduce((sum: number, apt: any) => sum + (apt.price || 0), 0),
            clients: new Set(activePrev.map((apt: any) => apt.clientName)).size
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

    const filteredStats = {
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

    return <Stats data={filteredStats} />;
}
