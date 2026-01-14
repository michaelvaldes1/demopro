import React from 'react';
import { Scissors, DollarSign, Clock } from 'lucide-react';
import { getServices } from '../actions';
import { Service } from './Types';
import ServiceItemActions from './ServiceItemActions';

interface ServicesListProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export default async function ServicesList({ searchParams }: ServicesListProps) {
    const allServices = await getServices();

    const params = await searchParams;
    const query = params.q?.toLowerCase() || "";
    const category = params.category || "Todos";

    const filteredServices = allServices.filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(query) ||
            service.description?.toLowerCase().includes(query);
        const matchesCategory = category === "Todos" || service.category === category;
        return matchesSearch && matchesCategory;
    });

    if (filteredServices.length === 0) {
        return (
            <div className="text-white/30 py-20 text-center">
                <Scissors size={48} strokeWidth={1} className="mx-auto mb-4" />
                <p className="text-sm font-medium">No hay servicios registrados</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 p-6">
            {filteredServices.map((service) => (
                <div key={service.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group items-start">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                        {service.imageUrl ? (
                            <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                        ) : (
                            <Scissors className="text-white/20" size={24} />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base">{service.name}</h3>
                        <p className="text-white/50 text-sm mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="inline-flex items-center gap-1 text-[#E5B454] text-xs font-bold">
                                <DollarSign size={14} />
                                {service.price}
                            </span>
                            <span className="inline-flex items-center gap-1 text-white/40 text-xs font-bold">
                                <Clock size={14} />
                                {service.duration}
                            </span>
                            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/40 text-[10px] font-bold uppercase">
                                {service.category}
                            </span>
                        </div>
                    </div>

                    <ServiceItemActions service={service} />
                </div>
            ))}
        </div>
    );
}
