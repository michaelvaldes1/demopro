import { Barber, Service, DayInfo, TimeSlot } from '../components/booking/types';

export const MOCK_BARBERS: Barber[] = [
    {
        id: 'b1',
        name: 'Pedro',
        role: 'Especialista en cortes clásicos',
        imageUrl: '/barbers/pedro.png',
        isAvailable: true,
    },
    {
        id: 'b2',
        name: 'Juan',
        role: 'Experto en estilos modernos',
        imageUrl: '/barbers/juan.png',
        isAvailable: true,
    },
    {
        id: 'b3',
        name: 'Luis',
        role: 'Maestro barbero tradicional',
        imageUrl: '/barbers/luis.png',
        isAvailable: true,
    },
];

import { SERVICES } from '../constants/constants';

export const MOCK_SERVICES: Service[] = SERVICES.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    // Extract number from string "45 min" -> 45
    duration: parseInt(service.duration) || 0,
    price: service.price
}));

import { addDays, format, isSunday, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateMockDays = (startDate: Date = new Date()): DayInfo[] => {
    const start = startOfMonth(startDate);
    const end = endOfMonth(startDate);
    const today = startOfDay(new Date());

    const allDays = eachDayOfInterval({ start, end });

    return allDays.map(date => {
        const dayName = format(date, 'EEE', { locale: es });
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        return {
            dayName: capitalizedDayName,
            dateNumber: date.getDate(),
            fullDate: format(date, 'yyyy-MM-dd'),
            isSelectable: !isSunday(date) && !isBefore(startOfDay(date), today),
        };
    });
};

export const MOCK_TIME_SLOTS: TimeSlot[] = [
    { id: 't1', time: '09:00 AM', isAvailable: true },
    { id: 't2', time: '10:00 AM', isAvailable: true },
    { id: 't3', time: '11:00 AM', isAvailable: false },
    { id: 't4', time: '12:00 PM', isAvailable: true },
    { id: 't5', time: '01:00 PM', isAvailable: true },
    { id: 't6', time: '02:00 PM', isAvailable: true },
    { id: 't7', time: '03:00 PM', isAvailable: false },
    { id: 't8', time: '04:00 PM', isAvailable: true },
    { id: 't9', time: '05:00 PM', isAvailable: true },
    { id: 't10', time: '06:00 PM', isAvailable: true },
    { id: 't11', time: '07:00 PM', isAvailable: true },
    { id: 't12', time: '08:00 PM', isAvailable: true },
    { id: 't13', time: '09:00 PM', isAvailable: true },
];
