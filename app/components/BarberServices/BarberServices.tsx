"use client";

import React, { useState } from 'react';
import { SERVICES, CATEGORIES } from '../../constants/constants';
import ServiceCard from './ServicesCard';
import { Button } from '@heroui/react';

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredServices = activeCategory === 'All'
        ? SERVICES
        : SERVICES.filter(s => s.category === activeCategory);

    return (
        <div className="py-8">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-white text-3xl font-black uppercase tracking-tight">Servicios Exclusivos</h2>
                    <p className="text-zinc-400 text-sm font-medium">Elige el servicio que mejor se adapte a tu estilo.</p>
                </div>

                {/* Categories Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat.value}
                            onPress={() => setActiveCategory(cat.value)}
                            className={`rounded-full px-6 transition-all font-bold ${activeCategory === cat.value
                                    ? 'bg-[#edbc1d] text-black shadow-[0_0_20px_rgba(237,188,29,0.3)]'
                                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                }`}
                            size="sm"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                        <ServiceCard key={service.id} item={service} />
                    ))}
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
