import React from 'react';
import { getDashboardData } from '../actions';
import Timeline from './TimeLine';

interface TimelineContainerProps {
    date: string;
    barberId: string;
}

export default async function TimelineContainer({ date, barberId }: TimelineContainerProps) {
    const data = await getDashboardData(date);
    const { appointments } = data;

    const filteredAppointments = barberId === 'all'
        ? appointments
        : appointments.filter(apt => apt.barberId === barberId);

    return (
        <Timeline
            appointments={filteredAppointments}
            selectedDate={date}
            selectedBarberId={barberId}
        />
    );
}
