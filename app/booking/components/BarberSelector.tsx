import React from 'react';
import { Barber } from './types';
import { Check } from 'lucide-react';

interface BarberSelectorProps {
    barbers: Barber[];
    selectedBarberId: string;
    onSelect: (id: string) => void;
}

const BarberSelector: React.FC<BarberSelectorProps> = ({ barbers, selectedBarberId, onSelect }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-[12px] font-bold text-secondaryText uppercase tracking-[0.1em]">Select Barber</h3>
            <div className="flex gap-4 overflow-x-auto py-4 hide-scrollbar justify-center">
                {barbers.map((barber) => {
                    const isSelected = selectedBarberId === barber.id;
                    return (
                        <button
                            key={barber.id}
                            onClick={() => onSelect(barber.id)}
                            className={`
                flex-shrink-0 flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300
                ${isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'bg-zinc-900/50 hover:bg-zinc-800'}
              `}
                        >
                            <div className="relative">
                                <div
                                    className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-transparent"
                                    style={{ backgroundImage: `url(${barber.imageUrl})` }}
                                />
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-background rounded-full p-1 shadow-lg">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            <span className={`text-[13px] font-bold ${isSelected ? 'text-primary' : 'text-zinc-400'}`}>
                                {barber.name.split(' ')[0]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BarberSelector;
