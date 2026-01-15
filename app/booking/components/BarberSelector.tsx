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
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                Selecciona Barbero
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-6 pt-2 px-1 hide-scrollbar -mx-1">
                {barbers.map((barber) => {
                    const isSelected = selectedBarberId === barber.id;

                    return (
                        <button
                            key={barber.id}
                            onClick={() => onSelect(barber.id)}
                            className={`
                                relative flex-shrink-0 flex flex-col items-center gap-2 rounded-[1.25rem] transition-all duration-500 ease-out 
                                min-w-[90px] md:min-w-[110px] group
                                ${isSelected
                                    ? 'scale-105 shadow-[0_10px_20px_-5px_rgba(208,158,30,0.4)]'
                                    : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-1'
                                }
                                {/* AQUÍ ESTÁ EL AJUSTE DE HEIGHT: py-5 en lugar de p-2 */}
                                px-2 py-5
                            `}
                            style={isSelected ? {
                                backgroundColor: '#D09E1E', // COLOR EXACTO SOLICITADO
                            } : {}}
                        >
                            {/* Image Container */}
                            <div className="relative">
                                <div
                                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-cover bg-center transition-all duration-300 ${isSelected
                                            ? 'border-2 border-black/20 shadow-inner'
                                            : 'border border-white/10 group-hover:border-white/30 grayscale group-hover:grayscale-0'
                                        }`}
                                    style={{ backgroundImage: `url(${barber.imageUrl})` }}
                                />

                                {/* Selected Indicator Badge */}
                                <div className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full shadow-lg transition-all duration-300 ${isSelected
                                        ? 'bg-black text-[#D09E1E] scale-100 opacity-100'
                                        : 'bg-transparent text-transparent scale-0 opacity-0'
                                    }`}>
                                    <Check size={10} strokeWidth={4} className="md:w-3 md:h-3" />
                                </div>
                            </div>

                            {/* Name Label */}
                            <div className="flex flex-col items-center">
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 truncate max-w-[80px] ${isSelected ? 'text-black' : 'text-zinc-400 group-hover:text-white'
                                    }`}>
                                    {barber.name.split(' ')[0]}
                                </span>
                            </div>

                            {/* Active Shine Effect */}
                            {isSelected && (
                                <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BarberSelector;