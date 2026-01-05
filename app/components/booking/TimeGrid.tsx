
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
    <div className="space-y-3">
      <h3 className="text-[12px] font-bold text-secondaryText uppercase tracking-[0.1em]">{title}</h3>
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
                py-3 px-2 rounded-full text-[13px] font-bold transition-all duration-200 border
                ${isSelected
                  ? 'bg-[#D09E1E] border-[#D09E1E] text-black shadow-lg shadow-[#D09E1E]/20 scale-105'
                  : isDisabled
                    ? 'border-white/10 text-zinc-600 opacity-40 line-through'
                    : 'bg-zinc-900 border-white/10 text-white hover:border-[#D09E1E]/50 hover:text-[#D09E1E]'}
              `}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeGrid;
