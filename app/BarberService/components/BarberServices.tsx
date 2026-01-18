'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../constants/constants';
import ServiceCard from './ServicesCard';
import { getServices } from '../../admin/actions';
import { Button } from '@heroui/react';
import { Scissors } from 'lucide-react';

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            setLoading(true);
            try {
                const data = await getServices();
                setServices(data);
            } catch (error) {
                console.error("Error loading services:", error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    const filteredServices = activeCategory === 'All'
        ? services
        : services.filter(s => s.category === activeCategory);

    return (
        // MARGENES REDUCIDOS: px-2 en móvil, px-4 en escritorio
        <div className="py-8 px-2 md:px-4">
            <div className="flex flex-col gap-8">

                {/* Header Section */}
                <div className="relative px-2">
                    <div className="flex flex-col gap-1 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg uppercase">
                            Servicios <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D09E1E] to-[#D09E1E]">Exclusivos</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm font-medium tracking-wide uppercase pl-1">
                            Elige el servicio que mejor se adapte a tu estilo.
                        </p>
                    </div>
                </div>

                {/* Glass Filter Capsule */}
                <div className="relative px-1">
                    <div
                        className="inline-flex p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-x-auto no-scrollbar max-w-full"
                        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat.value}
                                onPress={() => setActiveCategory(cat.value)}
                                className={`rounded-full px-5 h-9 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 min-w-fit ${activeCategory === cat.value
                                    ? 'text-black scale-105'
                                    : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                style={activeCategory === cat.value ? {
                                    background: 'linear-gradient(135deg, #D09E1E 0%, #D09E1E 100%)',
                                    boxShadow: '0 4px 15px rgba(208, 158, 30, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                                } : {}}
                                size="sm"
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Services Grid or Loading */}
                <div className="relative min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64 w-full">
                            {/* Liquid Gold Spinner */}
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-md bg-[#D09E1E]/20"></div>
                                <div className="w-12 h-12 border-4 border-[#D09E1E] border-t-transparent rounded-full animate-spin relative z-10"></div>
                            </div>
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/20 gap-4 border border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                            <Scissors size={48} strokeWidth={1} />
                            <p className="text-sm font-bold uppercase tracking-widest">No hay servicios disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredServices.map((service) => (
                                <div key={service.id} className="transition-all duration-500 hover:-translate-y-1">
                                    <ServiceCard item={service} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}