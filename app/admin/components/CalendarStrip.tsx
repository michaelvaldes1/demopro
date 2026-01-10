'use client';
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    addMonths,
    subMonths,
    format,
    startOfToday,
    parseISO,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDate,
    setDate,
    lastDayOfMonth,
    isValid
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarStripProps {
    selectedDate: string; // YYYY-MM-DD
}

const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate }) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Current logic: The view is driven by the selectedDate.
    // If selectedDate is 2023-10-15, we show October.
    const currentDateObj = selectedDate ? parseISO(selectedDate) : startOfToday();

    // Generate all days for the month of the current selected date
    const monthStart = startOfMonth(currentDateObj);
    const monthEnd = endOfMonth(currentDateObj);

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(date => {
        const fullDate = format(date, 'yyyy-MM-dd');
        return {
            dayName: format(date, 'EEE', { locale: es }).toUpperCase().replace('.', ''),
            dayNumber: date.getDate(),
            fullDate: fullDate,
            isSelected: fullDate === selectedDate,
            isToday: fullDate === format(startOfToday(), 'yyyy-MM-dd')
        };
    });

    const monthName = format(currentDateObj, 'MMMM yyyy', { locale: es });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const handleDateUpdate = (newDate: Date) => {
        const dateStr = format(newDate, 'yyyy-MM-dd');
        const params = new URLSearchParams(window.location.search);
        params.set('date', dateStr);
        router.push(`/admin?${params.toString()}`);
        router.refresh();
    };

    const handleNextMonth = () => {
        // Move to the same day in next month, or last day if it doesn't exist
        const targetDay = currentDateObj.getDate();
        const nextMonth = addMonths(currentDateObj, 1);
        const lastDayOfNextMonth = lastDayOfMonth(nextMonth).getDate();

        let newDate = setDate(nextMonth, Math.min(targetDay, lastDayOfNextMonth));
        handleDateUpdate(newDate);
    };

    const handlePrevMonth = () => {
        // Move to the same day in prev month, or last day if it doesn't exist
        const targetDay = currentDateObj.getDate();
        const prevMonth = subMonths(currentDateObj, 1);
        const lastDayOfPrevMonth = lastDayOfMonth(prevMonth).getDate();

        let newDate = setDate(prevMonth, Math.min(targetDay, lastDayOfPrevMonth));
        handleDateUpdate(newDate);
    };

    // Auto-scroll to selected date on mount or when date changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const selectedElement = scrollContainerRef.current.querySelector(`[data-selected="true"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [selectedDate]);

    return (
        <div className="px-6 mt-6 space-y-4">
            {/* Month Header with Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <h2 className="text-lg font-bold text-white capitalize text-center flex-1">
                    {capitalizedMonth}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Strip */}
            <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2"
            >
                {days.map((day, idx) => (
                    <button
                        key={idx}
                        data-selected={day.isSelected}
                        onClick={() => handleDateUpdate(parseISO(day.fullDate))}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all flex-shrink-0 ${day.isSelected
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                            : 'bg-card-dark border border-zinc-800/50 text-zinc-500 hover:border-primary/50 hover:text-zinc-300'
                            }`}
                    >
                        <span className={`text-[10px] font-bold tracking-widest mb-1 ${day.isSelected ? 'opacity-90' : 'opacity-70'}`}>
                            {day.dayName}
                        </span>
                        <span className={`text-xl font-bold ${day.isSelected ? 'text-white' : 'text-zinc-300'}`}>
                            {day.dayNumber}
                        </span>
                        {day.isToday && !day.isSelected && (
                            <div className="w-1 h-1 rounded-full bg-primary mt-1"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CalendarStrip;
