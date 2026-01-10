'use client';
import React from 'react';
import { Day } from '../types';

const CalendarStrip: React.FC = () => {
    const days: Day[] = [
        { dayName: 'MON', dayNumber: 12 },
        { dayName: 'TUE', dayNumber: 13, isSelected: true },
        { dayName: 'WED', dayNumber: 14 },
        { dayName: 'THU', dayNumber: 15 },
        { dayName: 'FRI', dayNumber: 16 },
        { dayName: 'SAT', dayNumber: 17 },
    ];

    return (
        <div className="px-6 mt-6">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {days.map((day, idx) => (
                    <button
                        key={idx}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all ${day.isSelected
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-card-dark border border-slate-800/50 text-slate-500'
                            }`}
                    >
                        <span className={`text-[10px] font-bold tracking-widest mb-1 ${day.isSelected ? 'opacity-80' : ''}`}>
                            {day.dayName}
                        </span>
                        <span className="text-xl font-bold">{day.dayNumber}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CalendarStrip;
