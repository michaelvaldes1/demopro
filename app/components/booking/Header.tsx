
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 pt-12 pb-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface/50 border border-white/10 hover:bg-white/10 transition-colors">
        <ArrowLeft className="text-white" size={20} />
      </button>
      <h1 className="text-[17px] font-bold tracking-tight">Select Date & Time</h1>
      <div className="w-10"></div> {/* Balanced spacer */}
    </header>
  );
};

export default Header;
