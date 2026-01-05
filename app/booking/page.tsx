"use client";

import React, { useState } from 'react';
import Header from '../components/booking/Header';
import BarberSelector from '../components/booking/BarberSelector';
import CalendarSection from '../components/booking/CalendarSection';
import TimeGrid from '../components/booking/TimeGrid';
import SummaryCard from '../components/booking/SummaryCard';
import BottomNavBar from '../components/shared/BottomNavBar';
import { MOCK_BARBERS, MOCK_SERVICES, generateMockDays, MOCK_TIME_SLOTS } from '../constants/booking';
import { DayInfo } from '../components/booking/types';
import { addMonths, subMonths, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <BookingContent />
        </React.Suspense>
    );
}

function BookingContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');

    const [viewDate, setViewDate] = useState(new Date());
    const days = generateMockDays(viewDate);

    const [selectedBarberId, setSelectedBarberId] = useState(MOCK_BARBERS[0].id);
    const [selectedDate, setSelectedDate] = useState<DayInfo>(days[0]);
    const [selectedTimeId, setSelectedTimeId] = useState<string>('');

    // Initialize services with the one from URL or default
    const initialService = MOCK_SERVICES.find(s => s.id === serviceId) || MOCK_SERVICES[0];
    const [selectedServices, setSelectedServices] = useState<typeof MOCK_SERVICES>([initialService]);

    const selectedBarber = MOCK_BARBERS.find(b => b.id === selectedBarberId);
    const selectedTime = MOCK_TIME_SLOTS.find(t => t.id === selectedTimeId);

    const handleAddService = (service: typeof MOCK_SERVICES[0]) => {
        if (!selectedServices.find(s => s.id === service.id)) {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleRemoveService = (id: string) => {
        if (selectedServices.length > 1) {
            setSelectedServices(selectedServices.filter(s => s.id !== id));
        }
    };

    const handleNextMonth = () => {
        setViewDate(prev => addMonths(prev, 1));
    };

    const handlePrevMonth = () => {
        setViewDate(prev => subMonths(prev, 1));
    };

    const handleConfirm = () => {
        if (!selectedTimeId) {
            alert("Por favor selecciona una hora");
            return;
        }
        console.log("Booking confirmed:", {
            barber: selectedBarber?.name,
            date: selectedDate.fullDate,
            time: selectedTime?.time,
            services: selectedServices.map(s => s.name)
        });
        alert("¡Cita agendada con éxito!");
    };

    return (
        <div className="min-h-screen bg-background text-white pb-32 max-w-2xl mx-auto shadow-2xl overflow-hidden relative">
            <Header />

            <main className="px-6 space-y-8 mt-4">
                {/* Barber Selection */}
                <BarberSelector
                    barbers={MOCK_BARBERS}
                    selectedBarberId={selectedBarberId}
                    onSelect={setSelectedBarberId}
                />

                {/* Calendar Section */}
                <CalendarSection
                    days={days}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    currentMonth={viewDate}
                    onNextMonth={handleNextMonth}
                    onPrevMonth={handlePrevMonth}
                />

                {/* Time Selection */}
                <div className="space-y-6">
                    <TimeGrid
                        title="Mañana"
                        slots={MOCK_TIME_SLOTS.slice(0, 3)}
                        selectedId={selectedTimeId}
                        onSelect={setSelectedTimeId}
                    />
                    <TimeGrid
                        title="Tarde"
                        slots={MOCK_TIME_SLOTS.slice(3)}
                        selectedId={selectedTimeId}
                        onSelect={setSelectedTimeId}
                    />
                </div>
            </main>

            {/* Fixed Summary & Confirm */}
            {selectedTimeId && (
                <SummaryCard
                    services={selectedServices}
                    availableServices={MOCK_SERVICES}
                    barberName={selectedBarber?.name || "No seleccionado"}
                    date={`${selectedDate.dayName} ${selectedDate.dateNumber} de ${format(parseISO(selectedDate.fullDate), 'MMMM', { locale: es })}`}
                    time={selectedTime?.time || ""}
                    onConfirm={handleConfirm}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                />
            )}

            <div className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 z-40">
                <BottomNavBar />
            </div>
        </div>
    );
}
