"use client";
import React from 'react';
import { Button } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function FloatingActionButton() {
    const handlePress = () => {
        // Navigate to booking
        console.log("Navigating to booking...");
        // window.location.href = "#booking"; 
    };

    return (
        <Link href="/booking" className="fixed bottom-30 right-5 z-40">
            <Button
                className="bg-[#D09E1E] text-black font-black px-4 py-2 h-auto rounded-full shadow-[0_10px_30px_rgba(208,158,30,0.4)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group"
            >
                <div className="bg-black/20 p-1.5 rounded-full group-hover:bg-black/30 transition-colors">
                    <CalendarDays size={16} />
                </div>
                <span className="text-sm">Agendar ahora</span>
            </Button>
        </Link>
    );
}
