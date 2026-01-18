"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Home, Scissors, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
};

const navItems: NavItem[] = [
    { label: "Inicio", icon: <Home size={22} strokeWidth={2} />, href: "/dashboard" },
    { label: "Servicios", icon: <Scissors size={22} strokeWidth={2} />, href: "/BarberService" },
    { label: "Agenda", icon: <Calendar size={22} strokeWidth={2} />, href: "/booking" },
    { label: "Contacto", icon: <Mail size={22} strokeWidth={2} />, href: "/contact" },
];

export default function BottomNavBar() {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [mounted, setMounted] = React.useState(false);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    if (!mounted) return null;
    if (!loading && !user) return null;

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex w-[calc(100%-2rem)] md:w-auto md:min-w-[420px]">
            {/* Liquid Glass Capsule */}
            <div
                className="relative w-full group rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-out border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-[30px]"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 1. Refraction Line (Top Edge Light) */}
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />

                {/* 2. Liquid Light Follower (Gold Tint) */}
                <div
                    className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(208, 158, 30, 0.15), transparent 80%)`,
                        opacity: isHovered ? 1 : 0,
                    }}
                />

                {/* 3. Navigation Items */}
                <div className="relative flex items-center justify-between px-2 py-2 md:px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/" && pathname === null);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative flex-1 flex flex-col items-center justify-center py-3 min-w-[70px] group/item"
                            >
                                {/* Active Background Pill (Subtle) */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-white/5 rounded-[1.5rem] scale-90 transition-transform duration-300" />
                                )}

                                {/* Icon Container */}
                                <div
                                    className={`relative z-10 transition-all duration-500 ease-out mb-1 ${isActive
                                        ? "text-[#D09E1E] scale-110 drop-shadow-[0_0_15px_rgba(208,158,30,0.6)] -translate-y-1"
                                        : "text-white/40 group-hover/item:text-white/80 group-hover/item:scale-105"
                                        }`}
                                >
                                    {item.icon}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-500 ${isActive
                                        ? "text-white opacity-100 translate-y-0"
                                        : "text-white/40 opacity-0 group-hover/item:opacity-70 translate-y-2 group-hover/item:translate-y-0 absolute bottom-1 scale-75 group-hover/item:scale-100 group-hover/item:relative"
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Active Dot Indicator */}
                                <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-[#D09E1E] transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                    }`} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}