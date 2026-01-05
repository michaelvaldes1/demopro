import React from 'react';
import Link from 'next/link';
import { ServiceItem } from '../../constants/types';
import { Plus } from 'lucide-react';

interface ServiceCardProps {
    item: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item }) => {
    return (
        <div className="group flex gap-4 rounded-xl bg-[#2a261a] p-4 transition-all hover:bg-[#343021] border border-transparent hover:border-[#edbc1d20] cursor-pointer">
            <div className="flex flex-1 flex-col justify-center">
                <div className="flex justify-between items-start">
                    <h4 className="text-white text-base font-semibold leading-normal">{item.name}</h4>
                    <span className="text-[#edbc1d] text-base font-bold leading-normal ml-2">${item.price}</span>
                </div>
                <p className="text-gray-400 text-sm font-normal leading-relaxed mt-1 line-clamp-2">
                    {item.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        {item.duration}
                    </span>
                </div>
            </div>
            <div className="shrink-0 self-center">
                <Link
                    href={`/booking?serviceId=${item.id}`}
                    className="flex size-10 items-center justify-center rounded-full bg-white/5 text-[#edbc1d] hover:bg-[#edbc1d] hover:text-black transition-all active:scale-95"
                >
                    <Plus size={20} />
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
