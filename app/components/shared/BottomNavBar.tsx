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
    { label: "Inicio", icon: <Home size={20} />, href: "/dashboard" },
    { label: "Servicios", icon: <Scissors size={20} />, href: "/BarberService" },
    { label: "Agenda", icon: <Calendar size={20} />, href: "/booking" },
    { label: "Contacto", icon: <Mail size={20} />, href: "/contact" },
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
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex w-[calc(100%-3rem)] md:w-auto md:min-w-[400px]">
            {/* Liquid Glass container */}
            <div
                className="relative w-full group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Base glass layer con blur intenso */}
                <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02] rounded-full border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_1px_0_rgba(255,255,255,0.3)_inset]" />

                {/* Gradiente líquido que sigue el mouse */}
                <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: isHovered
                            ? `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, rgba(208, 158, 30, 0.15), transparent 70%)`
                            : 'transparent'
                    }}
                />

                {/* Capa de reflejos superiores - efecto vidrio */}
                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                {/* Brillo superior edge */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

                {/* Resplandor inferior sutil */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-full bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

                {/* Contenido de navegación */}
                <div className="relative flex items-center justify-around py-3 px-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/" && pathname === null);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-500 min-w-[70px] group/item ${isActive
                                    ? "text-[#D09E1E]"
                                    : "text-zinc-300 hover:text-white"
                                    }`}
                            >
                                <div className={`relative transition-all duration-500 ${isActive
                                    ? "scale-110 drop-shadow-[0_0_12px_rgba(208,158,30,0.9)]"
                                    : "scale-100 group-hover/item:scale-105"
                                    }`}>
                                    {item.icon}
                                </div>

                                <span className="relative text-xs font-medium tracking-wide">
                                    {item.label}
                                </span>

                                {/* Indicador activo mejorado */}
                                {isActive && (
                                    <>
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D09E1E] shadow-[0_0_12px_rgba(208,158,30,1)]" />
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D09E1E] blur-sm animate-pulse" />
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Borde exterior brillante que pulsa sutilmente */}
                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
            `}</style>
        </nav>
    );
}