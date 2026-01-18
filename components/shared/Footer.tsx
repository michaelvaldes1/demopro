'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
    minimal?: boolean;
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
    return (
        <footer className={`bg-zinc-950 border-t border-white/5 pb-8 px-6 ${minimal ? 'pt-8' : 'pt-16'}`}>
            {!minimal && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Branding Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/miago-single.svg"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="drop-shadow-[0_0_8px_rgba(208,158,30,0.3)]"
                                />
                                <span className="text-2xl font-black tracking-tighter text-white">
                                    MIAGO<span className="text-[#D09E1E]">BARBER</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Donde el estilo se encuentra con la precisión. Brindamos la mejor experiencia de barbería tradicional con un toque moderno.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#E5B454] hover:border-[#E5B454]/30 transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#E5B454] hover:border-[#E5B454]/30 transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#E5B454] hover:border-[#E5B454]/30 transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Enlaces Rápidos</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/booking" className="text-zinc-500 hover:text-[#E5B454] text-sm transition-colors">Reservar Cita</Link>
                            </li>
                            <li>
                                <Link href="/#services" className="text-zinc-500 hover:text-[#E5B454] text-sm transition-colors">Nuestros Servicios</Link>
                            </li>
                            <li>
                                <Link href="/#barbers" className="text-zinc-500 hover:text-[#E5B454] text-sm transition-colors">Nuestros Barberos</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-zinc-500 hover:text-[#E5B454] text-sm transition-colors">Contacto</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Información</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#E5B454] shrink-0 mt-0.5" />
                                <span className="text-zinc-500 text-sm">Calle Principal #123, Ciudad de Panamá</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-[#E5B454] shrink-0" />
                                <span className="text-zinc-500 text-sm">+507 6214-6379</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-[#E5B454] shrink-0" />
                                <span className="text-zinc-500 text-sm">miagopty@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/Hours */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Horario de Atención</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Lunes - Viernes</span>
                                <span className="text-white font-medium">9:00 AM - 8:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Sábados</span>
                                <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Domingos</span>
                                <span className="text-[#E5B454] font-bold">Cerrado</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 pb-22 border-t border-white/5 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                    <a
                        href="https://miago.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group transition-all"
                    >
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Power By</span>
                        <div className="flex items-center gap-2">
                            <Image src="/miago-single.svg" alt="Logo" width={20} height={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="font-black text-[11px] tracking-widest text-zinc-600 group-hover:text-[#E5B454] transition-colors uppercase font-[family-name:var(--font-poppins)]">MIAGO</span>
                        </div>
                    </a>

                    <p className="text-zinc-600 text-[10px] md:text-xs text-center">
                        &copy; {new Date().getFullYear()} Miago. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
