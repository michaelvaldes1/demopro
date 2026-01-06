"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaTiktok, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Send } from 'lucide-react';
import BottomNavBar from '../components/shared/BottomNavBar';

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        alert('Mensaje enviado con éxito.');
    };

    // Estilos LiquidGlass para Inputs
    const inputStyles = `
        w-full bg-white/[0.03] backdrop-blur-md 
        border border-white/10 border-t-white/20 border-l-white/20
        rounded-2xl px-5 text-white placeholder:text-zinc-600 font-medium 
        outline-none transition-all duration-500
        hover:bg-white/[0.06] hover:border-white/30
        focus:bg-white/[0.08] focus:border-[#D09E1E] focus:ring-[6px] focus:ring-[#D09E1E]/10
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.2)]
    `;

    return (
        <div className="relative min-h-screen flex flex-col gap-12 pb-32 pt-12 px-4 w-full max-w-7xl mx-auto overflow-hidden">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                    Contacto
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                    ¿Tienes alguna duda o quieres agendar algo especial? Escríbenos y te responderemos a la brevedad.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start w-full relative z-10">

                {/* CONTAINER LIQUIDGLASS FORM */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full relative group"
                >
                    {/* Brillo de borde perimetral */}
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/30 via-transparent to-white/5 rounded-[2.5rem] blur-[1px] -z-10" />

                    <div className="bg-[#0a0a0a]/40 backdrop-blur-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] rounded-[2.5rem] p-8 md:p-12 w-full overflow-hidden relative">

                        {/* Reflejo superior interno */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {/* Nombre */}
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-zinc-300 text-[11px] font-bold uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                                    <input required name="name" type="text" placeholder="Escribe tu nombre" className={`${inputStyles} h-14`} />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-zinc-300 text-[11px] font-bold uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                                    <input required name="email" type="email" placeholder="ejemplo@correo.com" className={`${inputStyles} h-14`} />
                                </div>
                            </div>

                            {/* Asunto */}
                            <div className="flex flex-col gap-2.5 w-full">
                                <label className="text-zinc-300 text-[11px] font-bold uppercase tracking-[0.2em] ml-1">Asunto</label>
                                <input name="subject" type="text" placeholder="¿Sobre qué quieres hablar?" className={`${inputStyles} h-14`} />
                            </div>

                            {/* Mensaje */}
                            <div className="flex flex-col gap-2.5 w-full">
                                <label className="text-zinc-300 text-[11px] font-bold uppercase tracking-[0.2em] ml-1">Mensaje</label>
                                <textarea required name="message" rows={5} placeholder="Escribe tu mensaje aquí..." className={`${inputStyles} py-5 resize-none`} />
                            </div>

                            {/* Botón Liquid Style */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="relative group/btn overflow-hidden bg-[#D09E1E] text-black font-black uppercase tracking-[0.15em] h-16 rounded-2xl text-sm transition-all shadow-[0_20px_40px_rgba(208,158,30,0.2)] flex items-center justify-center gap-3 w-full"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D09E1E] to-[#f3ca52] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 group-hover/btn:text-black">Enviar Mensaje</span>
                                <Send size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* INFO SECTION */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col gap-6 w-full"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <LiquidCard icon={<FaPhone />} title="Teléfono" content="+507 0000-0000" />
                        <LiquidCard icon={<FaEnvelope />} title="Email" content="info@miagobarber.com" />
                        <LiquidCard icon={<FaMapMarkerAlt />} title="Ubicación" content="Calle Principal, Ciudad de Panamá" />
                        <LiquidCard icon={<FaWhatsapp />} title="WhatsApp" content="Chatea con nosotros" />
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-white font-bold text-xl uppercase italic">Síguenos en redes</h3>
                            <p className="text-zinc-500 text-xs tracking-widest uppercase">Conecta con el estudio</p>
                        </div>
                        <div className="flex gap-6">
                            <SocialIcon icon={<FaInstagram size={24} />} />
                            <SocialIcon icon={<FaTiktok size={24} />} />
                            <SocialIcon icon={<FaWhatsapp size={24} />} />
                        </div>
                    </div>
                </motion.div>
            </div>

            <BottomNavWrapper />
        </div>
    );
}

// Sub-componentes con estilo LiquidGlass
function LiquidCard({ icon, title, content }: any) {
    return (
        <div className="p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent">
            <div className="bg-[#0f0f0f]/60 backdrop-blur-2xl rounded-[1.9rem] p-6 flex flex-col gap-4 border border-white/5 w-full">
                <div className="text-[#D09E1E] bg-white/[0.05] w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
                    {icon}
                </div>
                <div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
                    <p className="text-white font-medium text-sm">{content}</p>
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ icon }: any) {
    return (
        <motion.a
            whileHover={{ y: -5, scale: 1.1 }}
            href="#"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-colors"
        >
            {icon}
        </motion.a>
    );
}

function BottomNavWrapper() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 py-8 px-4 flex justify-center pointer-events-none">
            <div className="w-full max-w-2xl pointer-events-auto">
                <BottomNavBar />
            </div>
        </div>
    );
}