export interface Barber {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    isAvailable: boolean;
}

export interface Service {
    id: string;
    name: string;
    duration: number;
    price: number;
}

export interface DayInfo {
    dayName: string;
    dateNumber: number;
    fullDate: string;
    isSelectable: boolean;
}

export interface TimeSlot {
    id: string;
    time: string;
    isAvailable: boolean;
}
