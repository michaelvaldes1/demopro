"use client";

import React, { useState } from 'react';
import TopBar from '../components/shared/TopBar';
import BarberSelector from './components/BarberSelector';
import CalendarSection from './components/CalendarSection';
import TimeGrid from './components/TimeGrid';
import SummaryCard from './components/SummaryCard';
import BottomNavBar from '../components/shared/BottomNavBar';
import { MOCK_BARBERS, MOCK_SERVICES, generateMockDays, MOCK_TIME_SLOTS } from '../constants/booking';
import { DayInfo } from './components/types';
import { addMonths, subMonths, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { createNotification } from '../lib/firebase/notifications';
import { useEffect } from 'react';
import { useDisclosure } from '@heroui/react';
import BookingConfirmationModal from './components/BookingConfirmationModal';

import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <BookingContent />
        </React.Suspense>
    );
}

import { getBarbers } from '../admin/actions';

function BookingContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const barberIdParam = searchParams.get('barberId');

    const [viewDate, setViewDate] = useState(new Date());
    const days = generateMockDays(viewDate);

    const { user } = useAuth();
    const [barbers, setBarbers] = useState<any[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange, onClose: onConfirmClose } = useDisclosure();

    const [selectedBarberId, setSelectedBarberId] = useState<string>('');

    // Load barbers from database
    useEffect(() => {
        const loadBarbers = async () => {
            try {
                const data = await getBarbers();
                setBarbers(data);

                // Find the barber from URL param or default to first
                const initialBarberId = data.find(b =>
                    b.name.toLowerCase() === barberIdParam?.toLowerCase() ||
                    b.id === barberIdParam
                )?.id || data[0].id;

                setSelectedBarberId(initialBarberId);
            } catch (error) {
                console.error("Error loading barbers:", error);
            }
        };
        loadBarbers();
    }, [barberIdParam]);

    // Default to today's date
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const initialDate = days.find(d => d.fullDate === todayStr) || days[0];
    const [selectedDate, setSelectedDate] = useState<DayInfo>(initialDate);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (selectedBarberId && selectedDate.fullDate) {
                try {
                    const response = await fetch(`/api/availability?date=${selectedDate.fullDate}&barberId=${selectedBarberId}`);
                    if (response.ok) {
                        const bookedTimes = await response.json();
                        setBookedSlots(bookedTimes);
                    }
                } catch (error) {
                    console.error("Error fetching availability:", error);
                }
            }
        };
        fetchBookedSlots();
    }, [selectedBarberId, selectedDate.fullDate]);

    // Helper to check if a specific time string (09:00 AM) on the selected date is in the past
    const isSlotInPast = (timeStr: string) => {
        const now = new Date();
        const selectedDateStr = selectedDate.fullDate;

        // If selected date is BEFORE today, all slots are past (though they should be disabled in calendar)
        if (selectedDateStr < todayStr) return true;

        // If selected date is TODAY, we need to compare times
        if (selectedDateStr === todayStr) {
            const [timePart, meridiem] = timeStr.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);

            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;

            const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            // Add a 5 or 10 min buffer if desired, or just use now
            return slotDate < now;
        }

        // Future dates
        return false;
    };

    // Update slots availability based on fetched bookedSlots and past time
    const timeSlots = MOCK_TIME_SLOTS.map(slot => ({
        ...slot,
        isAvailable: slot.isAvailable && !bookedSlots.includes(slot.time) && !isSlotInPast(slot.time)
    }));

    const [selectedTimeId, setSelectedTimeId] = useState<string>('');

    // Initialize services with the one from URL or default
    const initialService = MOCK_SERVICES.find(s => s.id === serviceId) || MOCK_SERVICES[0];
    const [selectedServices, setSelectedServices] = useState<typeof MOCK_SERVICES>([initialService]);

    const selectedBarber = barbers.find(b => b.id === selectedBarberId);
    const selectedTime = timeSlots.find(t => t.id === selectedTimeId);

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
        if (!selectedTimeId) return;

        setIsBookingSuccess(false);
        onConfirmOpen();
    };

    const finalizeBooking = async () => {
        if (!user || !selectedTime || !selectedBarber) return;

        setIsSaving(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/citas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.uid,
                    serviceId: selectedServices[0].id,
                    serviceName: selectedServices[0].name,
                    date: selectedDate.fullDate,
                    time: selectedTime.time,
                    barberId: selectedBarberId,
                    barberName: selectedBarber.name,
                    clientName: user.displayName || "Invitado",
                    clientEmail: user.email || "invitado@miago.com",
                    status: 'confirmed'
                })
            });

            if (response.ok) {
                const result = await response.json();
                setIsBookingSuccess(true);

                // Create notification (This should also eventually be a proxy call)
                await createNotification({
                    userId: user.email!,
                    title: "Cita Confirmada",
                    message: `Tu cita para ${selectedServices[0].name} el ${selectedDate.dayName} ${selectedDate.dateNumber} a las ${selectedTime.time} ha sido agendada con éxito.`,
                    isRead: false
                });

                // Refresh booked slots via the same proxy
                const refreshResponse = await fetch(`/api/citas?userId=${user.uid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (refreshResponse.ok) {
                    const allAppointments = await refreshResponse.json();
                    const filtered = allAppointments
                        .filter((apt: any) => apt.barberId === selectedBarberId && apt.date === selectedDate.fullDate && apt.status === 'confirmed')
                        .map((apt: any) => apt.time);
                    setBookedSlots(filtered);
                }

                setSelectedTimeId('');
            } else {
                const errorData = await response.json();
                console.error("Booking error via proxy:", errorData.error);
            }
        } catch (error) {
            console.error("Booking exception via proxy:", error);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="min-h-screen bg-background text-white pb-32 max-w-2xl mx-auto shadow-2xl overflow-hidden relative pt-16">
            <TopBar />

            <main className="px-6 space-y-8 mt-4">
                {/* Barber Selection */}
                <BarberSelector
                    barbers={barbers}
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
                        slots={timeSlots.slice(0, 3)}
                        selectedId={selectedTimeId}
                        onSelect={setSelectedTimeId}
                    />
                    <TimeGrid
                        title="Tarde"
                        slots={timeSlots.slice(3, 9)}
                        selectedId={selectedTimeId}
                        onSelect={setSelectedTimeId}
                    />
                    <TimeGrid
                        title="Noche"
                        slots={timeSlots.slice(9)}
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
                    onCancel={() => setSelectedTimeId('')}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                />
            )}

            {selectedBarber && selectedTime && (
                <BookingConfirmationModal
                    isOpen={isConfirmOpen}
                    onOpenChange={onConfirmOpenChange}
                    onConfirm={finalizeBooking}
                    isSaving={isSaving}
                    isSuccess={isBookingSuccess}
                    bookingData={{
                        service: selectedServices[0],
                        barberName: selectedBarber.name,
                        date: `${selectedDate.dayName} ${selectedDate.dateNumber} de ${format(parseISO(selectedDate.fullDate), 'MMMM', { locale: es })}`,
                        time: selectedTime.time,
                        clientName: user?.displayName || "Invitado",
                        clientEmail: user?.email || "N/A"
                    }}
                />
            )}

            <div className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 z-40">
                <BottomNavBar />
            </div>
        </div>
    );
}
