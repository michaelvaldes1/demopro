import React from 'react';
import { getDashboardData } from './actions';
import { format } from 'date-fns';
import DashboardClient from './components/DashboardClient';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
    const params = await searchParams;
    const selectedDate = typeof params.date === 'string' ? params.date : format(new Date(), 'yyyy-MM-dd');

    const { stats, appointments } = await getDashboardData(selectedDate);

    return (
        <DashboardClient
            stats={stats}
            appointments={appointments}
            selectedDate={selectedDate}
        />
    );
}