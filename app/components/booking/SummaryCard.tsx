import React, { useState, useEffect } from 'react';
import { Service } from './types';
import { Clock, ArrowRight, User, Calendar, Trash2, Plus, X } from 'lucide-react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';

interface SummaryCardProps {
  services: Service[];
  availableServices: Service[];
  barberName: string;
  date: string;
  time: string;
  onConfirm: () => void;
  onAddService: (service: Service) => void;
  onRemoveService: (serviceId: string) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  services,
  availableServices,
  barberName,
  date,
  time,
  onConfirm,
  onAddService,
  onRemoveService
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddService, setShowAddService] = useState(false);

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

  useEffect(() => {
    setIsExpanded(true);
  }, [time, date, barberName, services.length]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y > threshold) {
      setIsExpanded(false);
    } else if (info.offset.y < -threshold) {
      setIsExpanded(true);
    }
  };

  const variants = {
    expanded: { y: 0 },
    collapsed: { y: "calc(100% - 85px)" }
  };

  return (
    <>
      <AnimatePresence>
        {showAddService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddService(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-zinc-900 w-full max-w-md rounded-3xl overflow-hidden border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-800/50">
                <h3 className="font-bold text-white">Agregar Servicio</h3>
                <button onClick={() => setShowAddService(false)} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                {availableServices.filter(s => !services.find(active => active.id === s.id)).map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      onAddService(service);
                      setShowAddService(false);
                    }}
                    className="flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#D09E1E]/30 transition-all group text-left"
                  >
                    <div>
                      <p className="font-bold text-white group-hover:text-[#D09E1E] transition-colors">{service.name}</p>
                      <p className="text-xs text-zinc-400">{service.duration} min</p>
                    </div>
                    <span className="font-bold text-[#D09E1E]">${service.price}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={variants}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-2xl rounded-t-[32px] p-6 pt-4 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50 max-w-2xl mx-auto"
      >
        <div className="w-full flex justify-center pb-6 pt-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[18px] font-extrabold text-white">Resumen de Reserva</h4>
              <p className="text-[13px] text-zinc-400 mt-1">{services.length} servicio{services.length !== 1 ? 's' : ''} seleccionado{services.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-[24px] font-black text-[#D09E1E]">${totalPrice.toFixed(2)}</p>
              <p className="text-[11px] text-zinc-500 font-medium bg-black/20 px-2 py-0.5 rounded-full inline-block mt-1">Total Estimado</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {services.map((service, index) => (
              <div key={`${service.id}-${index}`} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-sm text-zinc-200">{service.name}</p>
                  <p className="text-xs text-zinc-500">{service.duration} min • ${service.price}</p>
                </div>
                {services.length > 1 && (
                  <button
                    onClick={() => onRemoveService(service.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-[#D09E1E] hover:border-[#D09E1E] hover:bg-[#D09E1E]/5 transition-all text-sm font-medium"
            >
              <Plus size={16} />
              Agregar otro servicio
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
              <User size={14} className="text-[#D09E1E]" />
              <span className="text-xs font-medium text-zinc-300">{barberName}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
              <Calendar size={14} className="text-[#D09E1E]" />
              <span className="text-xs font-medium text-zinc-300 truncate">{date}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
              <Clock size={14} className="text-[#D09E1E]" />
              <span className="text-xs font-medium text-zinc-300">{time}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
              <Clock size={14} className="text-[#D09E1E]" />
              <span className="text-xs font-medium text-zinc-300">Total: {totalDuration} min</span>
            </div>
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full bg-[#D09E1E] hover:bg-[#b88a18] active:scale-[0.98] transition-all text-black font-black text-[17px] py-4 rounded-full flex items-center justify-center gap-2 shadow-xl shadow-[#D09E1E]/20 group"
        >
          Confirmar Reserva
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="h-4" />
      </motion.div>
    </>
  );
};

export default SummaryCard;
