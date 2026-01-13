"use client";

import React from 'react';
import { Spinner } from "@heroui/react";

export default function LoadingState() {
    return (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Brand Logo Animation */}
                <div className="mb-6 relative">
                    <div className="w-20 h-20 rounded-full border-2 border-[#D09E1E]/20 flex items-center justify-center animate-pulse">
                        <span className="text-4xl font-black text-[#D09E1E] select-none">M</span>
                    </div>
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-[#D09E1E] animate-spin h-20 w-20"></div>
                </div>

                {/* Text Loader */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase opacity-80">
                        MiagoBarber
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D09E1E] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#D09E1E] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#D09E1E] rounded-full animate-bounce"></div>
                    </div>
                </div>

                <p className="mt-8 text-zinc-500 text-sm font-medium animate-pulse">
                    Preparando tu experiencia premium...
                </p>
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D09E1E]/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
}
