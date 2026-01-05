"use client";
import React from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@heroui/react";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface BarberModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    barber: {
        name: string;
        image: string;
        coverImage: string;
        socials: {
            whatsapp: string;
            tiktok: string;
            instagram: string;
        };
    };
}

const portfolioImages = [
    "/services/haircut.png",
    "/services/beard.png",
    "/services/haircut.png",
    "/services/beard.png",
    "/services/haircut.png",
    "/services/beard.png",
];

export function BarberModal({ isOpen, onOpenChange, barber }: BarberModalProps) {
    const { isOpen: isStoryOpen, onOpen: onStoryOpen, onOpenChange: onStoryOpenChange } = useDisclosure();
    const [currentStoryIndex, setCurrentStoryIndex] = React.useState(0);

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
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
            classNames={{
                base: "bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden z-[200]",
                header: "border-0 p-0",
                body: "p-0",
                closeButton: "z-[210] bg-black/50 text-white hover:bg-black/70 mt-4 mr-4"
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalBody>
                            {/* Cover Section */}
                            <div className="relative h-48 md:h-64 w-full rounded-t-[2.5rem] overflow-hidden">
                                <Image
                                    src={barber.coverImage}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40" />

                                {/* Profile Pic overlapping cover */}
                                <div className="absolute -bottom-16 left-8 flex items-center justify-center z-20">
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-950 overflow-hidden shadow-2xl bg-zinc-900">
                                        <Image
                                            src={barber.image}
                                            alt={barber.name}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="mt-20 px-8 pb-8">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                            {barber.name}
                                        </h2>
                                        <p className="text-zinc-400 font-medium">Barbero Top en MIAGOBARBER</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            className="bg-[#25D366] text-white hover:scale-110"
                                            as="a"
                                            href={barber.socials.whatsapp}
                                            target="_blank"
                                        >
                                            <FaWhatsapp size={20} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:scale-110"
                                            as="a"
                                            href={barber.socials.instagram}
                                            target="_blank"
                                        >
                                            <FaInstagram size={20} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            radius="full"
                                            className="bg-black text-white border border-zinc-800 hover:scale-110"
                                            as="a"
                                            href={barber.socials.tiktok}
                                            target="_blank"
                                        >
                                            <FaTiktok size={18} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Portafolio</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {portfolioImages.map((src, i) => (
                                            <div
                                                key={i}
                                                onClick={() => handlePortfolioClick(i)}
                                                className="aspect-square relative rounded-2xl overflow-hidden group cursor-pointer"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Project ${i + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>

            {/* Story Viewer Modal */}
            <Modal
                isOpen={isStoryOpen}
                onOpenChange={onStoryOpenChange}
                size="full"
                backdrop="blur"
                classNames={{
                    base: "bg-black/95 z-[300]",
                    closeButton: "hidden",
                    wrapper: "z-[300]",
                    backdrop: "z-[290]"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <div className="relative w-full h-full flex flex-col items-center justify-center md:p-10">
                            {/* Close Button Top Right */}
                            <Button
                                isIconOnly
                                onPress={onClose}
                                variant="light"
                                className="absolute top-4 right-4 md:top-10 md:right-10 text-white hover:bg-white/10 z-[310]"
                            >
                                <X size={28} className="md:w-8 md:h-8" />
                            </Button>

                            {/* Story Container */}
                            <div className="relative w-full max-w-[500px] h-[80vh] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
                                {/* Navigation Indicators */}
                                <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
                                    {portfolioImages.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${i === currentStoryIndex ? "bg-white" : "bg-white/30"}`}
                                        />
                                    ))}
                                </div>

                                {/* Image */}
                                <Image
                                    src={portfolioImages[currentStoryIndex]}
                                    alt="Story"
                                    fill
                                    className="object-cover"
                                />

                                {/* Prev/Next Invisible clickable areas */}
                                <div className="absolute inset-0 flex z-30">
                                    <div className="flex-1 cursor-pointer" onClick={prevStory} />
                                    <div className="flex-1 cursor-pointer" onClick={() => nextStory(onClose)} />
                                </div>

                                {/* Visual Arrows (Visible on Desktop) */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block z-40">
                                    <Button
                                        isIconOnly
                                        onPress={prevStory}
                                        variant="flat"
                                        className="bg-black/20 backdrop-blur-md rounded-full text-white"
                                        isDisabled={currentStoryIndex === 0}
                                    >
                                        <ChevronLeft size={24} />
                                    </Button>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block z-40">
                                    <Button
                                        isIconOnly
                                        onPress={() => nextStory(onClose)}
                                        variant="flat"
                                        className="bg-black/20 backdrop-blur-md rounded-full text-white"
                                    >
                                        <ChevronRight size={24} />
                                    </Button>
                                </div>
                            </div>

                            {/* Info text */}
                            <div className="mt-6 text-white text-center">
                                <p className="font-bold text-lg">Portafolio de {barber.name}</p>
                                <p className="text-zinc-400 text-sm">{currentStoryIndex + 1} de {portfolioImages.length}</p>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </Modal>
    );
}
