"use client";
import React from 'react';
import Image from 'next/image';

export default function Hero() {
    return (
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-3xl mb-12">
            {/* Background Image */}
            <Image
                src="/hero_bg.png"
                alt="MiagoBarber Hero"
                fill
                className="object-cover"
                priority
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content at Bottom Right */}
            <div className="absolute bottom-8 left-8 text-left text-white max-w-sm">
                <p className="text-xs font-bold tracking-[0.2em] text-[#D09E1E] mb-2 uppercase">
                    BIENVENIDO A MIAGOBARBER
                </p>
                <h2 className="text-4xl md:text-5xl font-black mb-3">
                    Afina tu estilo
                </h2>
                <p className="text-sm md:text-base text-zinc-300 font-medium">
                    La excelencia en barbería clásica y moderna para el hombre de hoy.
                </p>
            </div>
        </div>
    );
}
