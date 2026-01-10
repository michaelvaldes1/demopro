
import React from 'react';
import { Barber } from './types';

interface BarberCardProps {
  barber: Barber;
}

const BarberCard: React.FC<BarberCardProps> = ({ barber }) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 ring-1 ring-white/5 shadow-xl">
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-[#D09E1E]"
          style={{ backgroundImage: `url(${barber.imageUrl})` }}
        />
        {barber.isAvailable && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-[#D09E1E] uppercase tracking-[0.08em] mb-0.5">Tu Barbero</p>
        <h3 className="text-white font-bold text-[16px] leading-tight">{barber.name}</h3>
        <p className="text-zinc-400 text-[13px]">{barber.role}</p>
      </div>
      <button className="text-[#D09E1E] text-[14px] font-semibold hover:opacity-80 transition-opacity">
        Cambiar
      </button>
    </div>
  );
};

export default BarberCard;
