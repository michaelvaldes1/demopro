"use client";
import React from 'react';
import Image from 'next/image';

const services = [
    {
        name: "Corte de cabello",
        image: "/services/haircut.png"
    },
    {
        name: "Barba",
        image: "/services/beard.png"
    },
    {
        name: "Cejas",
        image: "/services/haircut.png" // Reusing since quota reached
    },
    {
        name: "Pigmentación",
        image: "/services/beard.png" // Reusing since quota reached
    }
];

export default function Services() {
    return (
        <div className="mt-12" id="services">
            <h2 className="text-3xl font-black text-white mb-8">Nuestros Servicios</h2>

            <div className="flex overflow-x-auto pb-6 gap-6 no-scrollbar snap-x snap-mandatory">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-64 h-80 relative rounded-3xl overflow-hidden snap-start group"
                    >
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                {service.name}
                            </h3>
                        </div>
                    </div>
                ))}
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