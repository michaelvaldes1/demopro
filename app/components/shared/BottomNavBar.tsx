"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Home, Scissors, Image as ImageIcon, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
};

const navItems: NavItem[] = [
    { label: "Inicio", icon: <Home size={20} />, href: "/" },
    { label: "Servicios", icon: <Scissors size={20} />, href: "/services" },
    { label: "Agenda", icon: <ImageIcon size={20} />, href: "/booking" },
    { label: "Contacto", icon: <Mail size={20} />, href: "#contact" },
];

export default function BottomNavBar() {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Hide bottom nav if not authenticated (Login view)
    if (!loading && !user) return null;

    return (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex w-[calc(100%-3rem)] md:w-auto md:min-w-[400px]">
            {/* Glassmorphism container */}
            <div className="relative w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none">
                <div className="relative flex items-center justify-around py-3 px-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/" && pathname === null);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 min-w-[70px] ${isActive
                                        ? "text-[#D09E1E]"
                                        : "text-zinc-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <div className={`transition-all duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(208,158,30,0.8)]" : "scale-100"}`}>
                                    {item.icon}
                                </div>
                                <span className="text-xs font-medium">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D09E1E] shadow-[0_0_8px_rgba(208,158,30,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}