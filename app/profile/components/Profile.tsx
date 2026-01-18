"use client";
import { Avatar, Divider } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import { Mail, User, ShieldCheck, X } from "lucide-react";
import AppointmentHistory from "./AppointmentHistory";
import { useRouter } from "next/navigation";

export default function Profile({ onClose }: { onClose?: () => void }) {
    const { user } = useAuth();
    const router = useRouter();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Background Backdrop Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-[450px] z-[1000] animate-in fade-in zoom-in duration-300">
                {/* Liquid Glass Container */}
                <div
                    className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        backdropFilter: 'blur(50px)',
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-[1010] p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    >
                        <X size={18} />
                    </button>

                    {/* Refraction Line */}
                    <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                    <div className="p-8 flex flex-col gap-8">

                        {/* Header / Avatar Section */}
                        <div className="flex flex-col items-center text-center relative">
                            {/* Glow effect behind avatar */}
                            <div className="absolute top-0 w-32 h-32 bg-[#D09E1E]/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative p-1.5 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent mb-4 shadow-xl">
                                <Avatar
                                    src={user.photoURL || undefined}
                                    name={user.displayName?.split(' ').map(n => n[0]).join('') || "U"}
                                    className="w-24 h-24 text-large"
                                    isBordered
                                    imgProps={{
                                        referrerPolicy: "no-referrer",
                                        className: "object-cover"
                                    }}
                                    classNames={{
                                        base: "bg-zinc-900 ring-2 ring-[#D09E1E]/50",
                                        name: "text-[#D09E1E] font-bold"
                                    }}
                                />
                                {/* Verified Badge */}
                                <div className="absolute bottom-0 right-0 bg-[#D09E1E] text-black p-1.5 rounded-full border-2 border-[#09090b] shadow-lg">
                                    <ShieldCheck size={14} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-md">
                                    {user.displayName || "Usuario"}
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09E1E] animate-pulse" />
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Cliente MiagoBarber</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Tiles */}
                        <div className="grid gap-3">
                            <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-[#D09E1E] border border-white/5 shadow-inner">
                                    <User size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Nombre</span>
                                    <span className="text-sm font-bold text-white truncate">{user.displayName || "No configurado"}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-[#D09E1E] border border-white/5 shadow-inner">
                                    <Mail size={18} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Email</span>
                                    <span className="text-sm font-bold text-white truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider visual */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* History Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Historial</h4>
                                <div className="text-[9px] font-bold text-[#D09E1E]/50 uppercase tracking-tighter">Desliza para ver más</div>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
                                <AppointmentHistory />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-2">
                            <p className="text-[9px] text-white/20 italic text-center uppercase font-bold tracking-widest">
                                Gracias por confiar en MiagoBarber
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
