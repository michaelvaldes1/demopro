import React from 'react';
import { getDashboardData, getBarbers } from './actions';
import { format } from 'date-fns';
import DashboardClient from './components/DashboardClient';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
    const params = await searchParams;
    const selectedDate = typeof params.date === 'string' ? params.date : format(new Date(), 'yyyy-MM-dd');

    const [dashboardData, barbers] = await Promise.all([
        getDashboardData(selectedDate),
        getBarbers()
    ]);

    const { stats, prevStats, appointments, prevAppointments } = dashboardData;

    return (
        <DashboardClient
            stats={stats}
            prevStats={prevStats}
            appointments={appointments}
            prevAppointments={prevAppointments}
            selectedDate={selectedDate}
            barbers={barbers}
        />
    );
}