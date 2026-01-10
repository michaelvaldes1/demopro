import React from 'react';
import { TimeSlot } from './types';

interface TimeGridProps {
  title: string;
  slots: TimeSlot[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const TimeGrid: React.FC<TimeGridProps> = ({ title, slots, selectedId, onSelect }) => {
  return (
    <div className="space-y-4">
      {/* Título - Restaurado Original */}
      <h3 className="text-[12px] font-bold text-secondaryText uppercase tracking-[0.1em] ml-1">
        {title}
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          const isDisabled = !slot.isAvailable;

          return (
            <button
              key={slot.id}
              disabled={isDisabled}
              onClick={() => onSelect(slot.id)}
              className={`
                relative py-3 px-2 rounded-full text-[13px] font-bold transition-all duration-300 border
                flex items-center justify-center overflow-hidden
                ${isSelected
                  ? 'bg-[#D09E1E] border-[#D09E1E] text-black shadow-[0_10px_20px_rgba(208,158,30,0.3)] scale-105 z-10'
                  : isDisabled
                    ? 'border-white/5 text-zinc-600 opacity-20 line-through cursor-not-allowed bg-transparent'
                    : 'bg-white/[0.03] backdrop-blur-md border-white/10 text-white hover:border-[#D09E1E]/50 hover:text-[#D09E1E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'}
              `}
            >
              {/* Reflejo líquido para el estado no seleccionado */}
              {!isSelected && !isDisabled && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}

              {/* Brillo de resalte para el estado seleccionado (Liquid Gold) */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40 z-10" />
              )}

              <span className="relative z-10">{slot.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeGrid;