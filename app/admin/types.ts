export interface Stat {
    label: string;
    value: string;
    change: string;
    icon: string;
}

export interface Day {
    dayName: string;
    dayNumber: number;
    fullDate?: string;
    isSelected?: boolean;
}

export interface ScheduleItem {
    id: string;
    time: string;
    clientName?: string;
    service?: string;
    duration?: string;
    type: 'appointment' | 'available';
    icon?: string;
    status?: string;
    barberName?: string;
    barberId?: string;
    price?: number;
    isPast?: boolean;
    clientEmail?: string;
    clientAvatar?: string;
}
