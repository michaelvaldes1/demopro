"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { getBarbers } from '../../admin/actions';
import { BarberModal } from './BarberModal';
import { useDisclosure } from "@heroui/react";

export default function TopBarbers() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [barbers, setBarbers] = React.useState<any[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadBarbers = async () => {
            try {
                const data = await getBarbers();
                // Map the dynamic data to the format expected by the modal
                const transformed = data.map(b => ({
                    ...b,
                    image: b.imageUrl,
                    description: b.role,
                    coverImage: '/hero_bg.png', // Default cover
                    socials: b.socials || {
                        whatsapp: '',
                        tiktok: '',
                        instagram: ''
                    }
                }));
                setBarbers(transformed);
            } catch (error) {
                console.error("Error loading top barbers:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBarbers();
    }, []);

    const handleBarberClick = (barber: any) => {
        setSelectedBarber(barber);
        onOpen();
    };

    if (loading) return null; // Or a skeleton
    if (barbers.length === 0) return null;

    return (
        <div className="mt-16 mb-20">
            <h2 className="text-3xl font-black text-white mb-8">Nuestros Barberos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {barbers.map((barber) => (
                    <div
                        key={barber.id}
                        onClick={() => handleBarberClick(barber)}
                        className="group cursor-pointer flex flex-col items-center"
                    >
                        <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#D09E1E] transition-all duration-300">
                            <Image
                                src={barber.image}
                                alt={barber.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#D09E1E] transition-colors uppercase tracking-tight">
                            {barber.name}
                        </h3>
                        <p className="text-zinc-400 text-sm">{barber.description}</p>
                    </div>
                ))}
            </div>

            {selectedBarber && (
                <BarberModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    barber={selectedBarber}
                />
            )}
        </div>
    );
}
