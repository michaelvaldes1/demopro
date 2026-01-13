"use client";

import React, { useState, useEffect } from 'react';
import BarberSelector from './BarberSelector';
import CalendarSection from './CalendarSection';
import TimeGrid from './TimeGrid';
import SummaryCard from './SummaryCard';
import BookingConfirmationModal from './BookingConfirmationModal';
import { MOCK_SERVICES, generateMockDays, MOCK_TIME_SLOTS } from '../../constants/booking';
import { DayInfo } from './types';
import { addMonths, subMonths, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { createNotification } from '../../lib/firebase/notifications';
import { useDisclosure } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

interface BookingClientProps {
    initialBarbers: any[];
    initialServices: any[];
    barberIdParam: string | null;
    serviceIdParam: string | null;
}

export default function BookingClient({
    initialBarbers,
    initialServices,
    barberIdParam,
    serviceIdParam
}: BookingClientProps) {
    const [viewDate, setViewDate] = useState(new Date());
    const days = generateMockDays(viewDate);

    const { user } = useAuth();
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();

    const [selectedBarberId, setSelectedBarberId] = useState<string>(
        initialBarbers.find(b =>
            b.name.toLowerCase() === barberIdParam?.toLowerCase() ||
            b.id === barberIdParam
        )?.id || (initialBarbers.length > 0 ? initialBarbers[0].id : '')
    );

    // Default to today's date
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const initialDate = days.find(d => d.fullDate === todayStr) || days[0];
    const [selectedDate, setSelectedDate] = useState<DayInfo>(initialDate);
    const [selectedTimeId, setSelectedTimeId] = useState<string>('');

    // Initialize services state
    const mappedInitialServices = initialServices.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: parseInt(service.duration) || 45,
        price: service.price
    }));

    const [services] = useState<any[]>(mappedInitialServices.length > 0 ? mappedInitialServices : MOCK_SERVICES);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);

    useEffect(() => {
        if (services.length > 0) {
            let service = services.find(s => s.id === serviceIdParam);
            if (!service) {
                service = services.find(s => s.category === 'Corte de Cabello');
            }
            if (!service) {
                service = services[0];
            }
            if (service) {
                setSelectedServices([service]);
            }
        }
    }, [services, serviceIdParam]);

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

    const isSlotInPast = (timeStr: string) => {
        const now = new Date();
        const selectedDateStr = selectedDate.fullDate;
        if (selectedDateStr < todayStr) return true;
        if (selectedDateStr === todayStr) {
            const [timePart, meridiem] = timeStr.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            if (meridiem === 'PM' && hours !== 12) hours += 12;
            if (meridiem === 'AM' && hours === 12) hours = 0;
            const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            return slotDate < now;
        }
        return false;
    };

    const timeSlots = MOCK_TIME_SLOTS.map(slot => ({
        ...slot,
        isAvailable: slot.isAvailable && !bookedSlots.includes(slot.time) && !isSlotInPast(slot.time)
    }));

    const selectedBarber = initialBarbers.find(b => b.id === selectedBarberId);
    const selectedTime = timeSlots.find(t => t.id === selectedTimeId);

    const handleAddService = (service: any) => {
        if (!selectedServices.find(s => s.id === service.id)) {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleRemoveService = (id: string) => {
        if (selectedServices.length > 1) {
            setSelectedServices(selectedServices.filter(s => s.id !== id));
        }
    };

    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));
    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));

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
                setIsBookingSuccess(true);
                await createNotification({
                    userId: user.email!,
                    title: "Cita Confirmada",
                    message: `Tu cita para ${selectedServices[0].name} el ${selectedDate.dayName} ${selectedDate.dateNumber} a las ${selectedTime.time} ha sido agendada con éxito.`,
                    isRead: false
                });

                const refreshResponse = await fetch(`/api/citas?userId=${user.uid}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (refreshResponse.ok) {
                    const allAppointments = await refreshResponse.json();
                    const filtered = allAppointments
                        .filter((apt: any) => apt.barberId === selectedBarberId && apt.date === selectedDate.fullDate && apt.status === 'confirmed')
                        .map((apt: any) => apt.time);
                    setBookedSlots(filtered);
                }
                setSelectedTimeId('');
            }
        } catch (error) {
            console.error("Booking exception:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="px-6 space-y-8 mt-4">
            <BarberSelector
                barbers={initialBarbers}
                selectedBarberId={selectedBarberId}
                onSelect={setSelectedBarberId}
            />

            <CalendarSection
                days={days}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentMonth={viewDate}
                onNextMonth={handleNextMonth}
                onPrevMonth={handlePrevMonth}
            />

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

            {selectedTimeId && (
                <SummaryCard
                    services={selectedServices}
                    availableServices={services}
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
        </main>
    );
}
