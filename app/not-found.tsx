"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Scissors, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#09090b] overflow-hidden px-6">

            {/* --- FONDO "LIGHT PILLAR" (Tailwind Puro) --- */}
            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-[#D09E1E] rounded-full blur-[150px] opacity-[0.08]" />
                <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D09E1E]/50 to-transparent opacity-50" />
                <div className="absolute top-0 bottom-0 w-[100px] bg-gradient-to-b from-transparent via-[#D09E1E]/10 to-transparent blur-xl" />
                <div className="absolute top-[-10%] w-[400px] h-[300px] bg-[#D09E1E] rounded-full blur-[100px] opacity-10" />
            </div>

            {/* --- CONTENIDO --- */}
            <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg animate-in fade-in zoom-in duration-700">

                {/* Icono Animado */}
                <div className="relative mb-6 group cursor-default">
                    <div className="absolute -inset-6 bg-[#D09E1E]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                        <Scissors className="text-[#D09E1E] w-10 h-10 rotate-[-45deg] group-hover:rotate-0 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(229,180,84,0.5)]" />
                    </div>
                </div>

                {/* Texto 404 */}
                <h1 className="text-[100px] md:text-[150px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 select-none drop-shadow-2xl">
                    404
                </h1>

                <div className="mt-2 space-y-3 px-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                        ¡Corte fuera de lugar!
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                        Parece que la página que estás buscando ha pasado por la tijera y ya no existe.
                    </p>
                </div>

                {/* BOTONES */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full px-2 sm:px-0">
                    <Button
                        as={Link}
                        href="/"
                        size="lg"
                        className="w-full sm:flex-1 h-14 md:h-14 rounded-2xl bg-[#D09E1E] text-black font-extrabold uppercase tracking-tight text-sm shadow-[0_10px_40px_-10px_rgba(229,180,84,0.3)] hover:bg-[#D09E1E] hover:shadow-[0_20px_40px_-10px_rgba(229,180,84,0.5)] transition-all active:scale-[0.98]"
                        startContent={<Home className="w-5 h-5 mb-0.5" />} // Icono ajustado a 20px (w-5)
                    >
                        Regresar al Inicio
                    </Button>

                    <Button
                        size="lg"
                        variant="flat"
                        onPress={() => typeof window !== 'undefined' && window.history.back()}
                        className="w-full sm:flex-1 h-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold uppercase tracking-tight text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all backdrop-blur-md active:scale-[0.98]"
                        startContent={<ArrowLeft className="w-5 h-5 mb-0.5" />} // Icono ajustado a 20px (w-5)
                    >
                        Volver Atrás
                    </Button>
                </div>

                {/* Marca */}
                <p className="mt-16 text-[9px] uppercase tracking-[0.3em] font-black text-white/10 select-none">
                    MiagoBarber Premium Experience
                </p>
            </div>

            {/* Esquinas Decorativas */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-[#D09E1E]/20 rounded-tl-3xl pointer-events-none opacity-50" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-[#D09E1E]/20 rounded-br-3xl pointer-events-none opacity-50" />
        </div>
    );
}