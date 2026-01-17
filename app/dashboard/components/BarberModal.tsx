"use client";
import React from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { X, ChevronLeft, ChevronRight, Calendar, ImageIcon } from "lucide-react";

interface BarberModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    barber: {
        name: string;
        image: string;
        coverImage: string;
        portfolioImages?: string[];
        socials: {
            whatsapp: string;
            tiktok: string;
            instagram: string;
        };
    };
}

export function BarberModal({ isOpen, onOpenChange, barber }: BarberModalProps) {
    const { isOpen: isStoryOpen, onOpen: onStoryOpen, onOpenChange: onStoryOpenChange } = useDisclosure();
    const [currentStoryIndex, setCurrentStoryIndex] = React.useState(0);

    const portfolioImages = (barber.portfolioImages || []).filter((img: string) => img && img.trim() !== '');

    const handlePortfolioClick = (index: number) => {
        setCurrentStoryIndex(index);
        onStoryOpen();
    };

    const nextStory = (onClose?: () => void) => {
        if (currentStoryIndex < portfolioImages.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else if (onClose) {
            onClose();
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        }
    };

    return (
        <>
            {/* Main Barber Modal - Liquid Glass Style */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                backdrop="blur"
                // Importante: Eliminar header/footer por defecto para control total del layout y bordes
                hideCloseButton
                classNames={{
                    base: "!rounded-[2.5rem] !overflow-hidden bg-transparent shadow-none max-w-[500px] w-full mx-4",
                    wrapper: "z-[9999]",
                    backdrop: "backdrop-blur-2xl bg-black/50",
                }}
            >
                <ModalContent className="bg-transparent shadow-none p-0">
                    {(onClose) => (
                        <div
                            className="relative flex flex-col max-h-[85vh] w-full bg-gradient-to-br from-[#1a1a1e]/95 to-[#09090b]/98 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
                            style={{ backdropFilter: 'blur(40px)' }}
                        >
                            {/* Refraction Line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-50 pointer-events-none" />

                            {/* Close Button (Fixed on top of everything) */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                            >
                                <X size={18} />
                            </button>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto flex-1 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {/* Cover Image Container */}
                                <div className="relative w-full h-56">
                                    <Image
                                        src={barber.coverImage || '/placeholder-cover.jpg'}
                                        alt={`${barber.name} cover`}
                                        fill
                                        className="object-cover opacity-90"
                                    />
                                    {/* Gradient Fade at bottom of cover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30" />
                                </div>

                                {/* Profile Content (Overlapping) */}
                                <div className="px-8 relative z-10 -mt-20">
                                    <div className="flex flex-col items-center">
                                        {/* Profile Image - Now nicely overlapping without clipping */}
                                        <div className="relative mb-4 group">
                                            <div className="absolute -inset-1 bg-gradient-to-br from-[#E5B454] to-[#D09E1E] rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
                                            <div className="relative w-36 h-36 rounded-full border-[5px] border-[#09090b] overflow-hidden shadow-2xl bg-zinc-900">
                                                <Image
                                                    src={barber.image}
                                                    alt={barber.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tight text-center drop-shadow-lg">
                                            {barber.name}
                                        </h2>
                                        <div className="mt-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                                            <p className="text-[#E5B454] text-[10px] font-black uppercase tracking-[0.2em]">
                                                Barbero Profesional
                                            </p>
                                        </div>

                                        {/* Social Links */}
                                        <div className="flex gap-3 mt-8">
                                            {[
                                                { icon: FaWhatsapp, link: barber.socials.whatsapp ? `https://wa.me/${barber.socials.whatsapp}` : null, color: "hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/10" },
                                                { icon: FaInstagram, link: barber.socials.instagram ? `https://instagram.com/${barber.socials.instagram}` : null, color: "hover:text-[#E1306C] hover:border-[#E1306C]/30 hover:bg-[#E1306C]/10" },
                                                { icon: FaTiktok, link: barber.socials.tiktok ? `https://tiktok.com/@${barber.socials.tiktok}` : null, color: "hover:text-white hover:border-white/30 hover:bg-white/10" }
                                            ].map((social, idx) => social.link && (
                                                <a
                                                    key={idx}
                                                    href={social.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white/40 transition-all duration-300 ${social.color} hover:scale-110 active:scale-95 hover:shadow-xl`}
                                                >
                                                    <social.icon size={22} />
                                                </a>
                                            ))}
                                        </div>

                                        {/* Portfolio Section */}
                                        {portfolioImages.length > 0 && (
                                            <div className="w-full mt-10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2 rounded-xl bg-white/5 text-[#E5B454] border border-white/5">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Portafolio</h3>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    {portfolioImages.map((src, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => handlePortfolioClick(i)}
                                                            className="aspect-square relative rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-white/20 transition-colors"
                                                        >
                                                            <Image
                                                                src={src}
                                                                alt={`Work ${i}`}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="p-6 border-t border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-20">
                                <Button
                                    className="w-full h-14 rounded-2xl font-black text-black uppercase tracking-wide text-sm shadow-[0_0_30px_-5px_rgba(208,158,30,0.3)] hover:shadow-[0_0_40px_-5px_rgba(208,158,30,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    }}
                                    onPress={() => window.location.href = `/booking?barberId=${barber.name.toLowerCase()}`}
                                >
                                    <Calendar className="mr-2" size={18} strokeWidth={2.5} />
                                    Agendar Cita
                                </Button>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>

            {/* Story Viewer Modal - Immersive Dark Mode */}
            <Modal
                isOpen={isStoryOpen}
                onOpenChange={onStoryOpenChange}
                size="full"
                backdrop="blur"
                classNames={{
                    base: "bg-black/95",
                    closeButton: "hidden",
                    wrapper: "z-[9999]",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                            {/* Controls */}
                            <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-50 bg-gradient-to-b from-black/80 to-transparent">
                                <div className="flex gap-1 flex-1 max-w-md mx-auto">
                                    {portfolioImages.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === currentStoryIndex ? "bg-white shadow-[0_0_10px_white]" : "bg-white/20"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    isIconOnly
                                    onPress={onClose}
                                    className="absolute right-4 top-4 md:right-8 md:top-8 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10"
                                >
                                    <X size={24} />
                                </Button>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full max-w-3xl h-[85vh] flex items-center justify-center">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden md:border border-white/10 md:shadow-2xl">
                                    <Image
                                        src={portfolioImages[currentStoryIndex]}
                                        alt="Portfolio Story"
                                        fill
                                        className="object-contain md:object-cover bg-zinc-900"
                                        priority
                                    />
                                </div>

                                {/* Navigation Zones */}
                                <div className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-pointer" onClick={prevStory} />
                                <div className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-pointer" onClick={() => nextStory(onClose)} />

                                {/* Arrows */}
                                <Button
                                    isIconOnly
                                    onPress={prevStory}
                                    isDisabled={currentStoryIndex === 0}
                                    className="hidden md:flex absolute left-[-60px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 w-12 h-12"
                                >
                                    <ChevronLeft size={24} />
                                </Button>
                                <Button
                                    isIconOnly
                                    onPress={() => nextStory(onClose)}
                                    className="hidden md:flex absolute right-[-60px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 w-12 h-12"
                                >
                                    <ChevronRight size={24} />
                                </Button>
                            </div>

                            <div className="absolute bottom-8 left-0 right-0 text-center z-50">
                                <p className="text-white/80 font-bold text-lg drop-shadow-md">
                                    {barber.name} <span className="text-[#E5B454] mx-2">•</span> Portafolio
                                </p>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}