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
  onCancel: () => void;
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
  onCancel,
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

  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent | MouseEvent) => {
      if (!isExpanded || showAddService) return;
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside, true);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside, true);
    };
  }, [isExpanded, showAddService]);

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
    collapsed: { y: "calc(100% - 95px)" }
  };

  // Estilo base para elementos de cristal interno
  const glassLayer = "bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]";

  return (
    <>
      <AnimatePresence>
        {showAddService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddService(false)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.9 }}
              className="w-full max-w-md rounded-[2.5rem] overflow-hidden relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Línea de refracción superior (Efecto cristal iOS 26) */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              {/* Header de la Modal */}
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <h3 className="font-bold text-white tracking-tight">Agregar Servicio</h3>
                <button
                  onClick={() => setShowAddService(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors relative z-20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lista de Servicios */}
              <div className="p-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto no-scrollbar relative">
                {availableServices
                  .filter((s) => !services.find((active) => active.id === s.id))
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        onAddService(service);
                        setShowAddService(false);
                      }}
                      className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-[#D09E1E]/40 transition-all group text-left w-full"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-[#D09E1E] transition-colors">
                          {service.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                          {service.duration} min
                        </p>
                      </div>
                      <span className="font-black text-[#D09E1E] text-lg">
                        ${service.price}
                      </span>
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
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.8
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={() => !isExpanded && setIsExpanded(true)}
        ref={cardRef}
        className={`fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/60 backdrop-blur-3xl rounded-t-[3rem] p-7 pt-4 border-t border-white/20 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] z-50 max-w-2xl mx-auto overflow-hidden ${!isExpanded ? 'cursor-pointer' : ''}`}
      >
        {/* Reflejo de cristal en el borde superior */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="w-full flex justify-center pb-6 pt-1 cursor-grab active:cursor-grabbing">
          <div className="w-14 h-1.5 bg-white/10 rounded-full shadow-inner" />
        </div>

        <div className="flex flex-col gap-5 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-md font-black text-white tracking-tighter uppercase">Resumen de Reserva</h4>
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                {services.length} servicio{services.length !== 1 ? 's' : ''} seleccionado{services.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#D09E1E] drop-shadow-[0_0_15px_rgba(208,158,30,0.3)]">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full inline-block mt-1 border border-white/5">
                Total Estimado
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {services.map((service, index) => (
              <div key={`${service.id}-${index}`} className={`flex justify-between items-center p-4 rounded-2xl ${glassLayer}`}>
                <div>
                  <p className="font-bold text-sm text-white">{service.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{service.duration} min • ${service.price}</p>
                </div>
                {services.length > 1 && (
                  <button
                    onClick={() => onRemoveService(service.id)}
                    className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-zinc-500 hover:text-[#D09E1E] hover:border-[#D09E1E]/50 hover:bg-[#D09E1E]/5 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <Plus size={16} />
              Agregar otro servicio
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <InfoChip icon={<User size={14} />} text={barberName} />
            <InfoChip icon={<Calendar size={14} />} text={date} />
            <InfoChip icon={<Clock size={14} />} text={time} />
            <InfoChip icon={<Clock size={14} />} text={`Total: ${totalDuration} min`} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="w-full bg-[#D09E1E] hover:bg-[#eec045] active:scale-[0.97] transition-all text-black font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(208,158,30,0.2)] group relative overflow-hidden"
          >
            <span className="relative z-10">Confirmar Reserva</span>
            <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-white/5 hover:bg-red-500/10 active:scale-[0.97] transition-all text-zinc-500 hover:text-red-400 font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/5"
          >
            Cancelar Reserva
          </button>
        </div>

        <div className="h-6" />
      </motion.div>
    </>
  );
};

// Componente auxiliar para los chips de información
const InfoChip = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2.5 bg-white/[0.03] backdrop-blur-md border border-white/5 p-3 rounded-xl shadow-inner overflow-hidden">
    <div className="text-[#D09E1E]">{icon}</div>
    <span className="text-[11px] font-bold text-zinc-300 truncate tracking-tight">{text}</span>
  </div>
);

export default SummaryCard;