
import React, { useRef, useEffect } from 'react';
import { DayInfo } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarSectionProps {
  days: DayInfo[];
  selectedDate: DayInfo;
  onSelectDate: (day: DayInfo) => void;
  currentMonth: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  days,
  selectedDate,
  onSelectDate,
  currentMonth,
  onNextMonth,
  onPrevMonth
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const monthName = format(currentMonth, 'MMMM yyyy', { locale: es });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Scroll active date to center
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedButton = scrollContainerRef.current.querySelector(`[data-date="${selectedDate.fullDate}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="text-secondaryText hover:text-white transition-colors p-2"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-[18px] font-bold text-white capitalize text-center flex-1">
          {capitalizedMonth}
        </h2>

        <button
          onClick={onNextMonth}
          className="text-secondaryText hover:text-white transition-colors p-2"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-8 py-4"
      >
        {days.map((day) => {
          const isSelected = selectedDate.fullDate === day.fullDate;
          const isDisabled = !day.isSelectable;

          return (
            <button
              key={day.fullDate}
              data-date={day.fullDate}
              disabled={isDisabled}
              onClick={() => onSelectDate(day)}
              className={`
                flex flex-col items-center justify-center min-w-[66px] h-[86px] rounded-[22px] transition-all duration-300
                ${isSelected
                  ? 'bg-[#D09E1E] text-black shadow-lg shadow-[#D09E1E]/25 scale-105'
                  : isDisabled
                    ? 'opacity-20 cursor-not-allowed bg-zinc-900/50 grayscale'
                    : 'bg-zinc-900 border border-white/5 hover:border-[#D09E1E]/50 text-zinc-400'}
              `}
            >
              <span className={`text-[12px] font-semibold mb-1 ${isSelected ? 'font-bold' : 'text-secondaryText'}`}>
                {day.dayName}
              </span>
              <span className={`text-[20px] font-black ${isSelected ? '' : 'text-white'}`}>
                {day.dateNumber}
              </span>
              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-background mt-1.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarSection;
