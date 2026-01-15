'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Scissors, Instagram, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { addBarber } from '../../actions';

interface AddBarberModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSuccess: () => void;
}

export default function AddBarberModal({ isOpen, onOpenChange, onSuccess }: AddBarberModalProps) {
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newInstagram, setNewInstagram] = useState("");
    const [newWhatsapp, setNewWhatsapp] = useState("");
    const [newTiktok, setNewTiktok] = useState("");
    const [portfolioImages, setPortfolioImages] = useState<string[]>(Array(6).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const portfolioInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setNewName("");
            setNewRole("");
            setNewImage("");
            setNewInstagram("");
            setNewWhatsapp("");
            setNewTiktok("");
            setPortfolioImages(Array(6).fill(""));
        }
    }, [isOpen]);

    // Helper function to compress image to max 1MB
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions to reduce file size
                    const maxDimension = 1920;
                    if (width > height && width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Start with quality 0.9 and reduce if needed
                    let quality = 0.9;
                    let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                    // Keep reducing quality until under 1MB
                    while (compressedDataUrl.length > 1024 * 1024 && quality > 0.1) {
                        quality -= 0.1;
                        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    }

                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                setNewImage(compressedImage);
            } catch (error) {
                console.error("Error compressing image:", error);
                alert("Error al procesar la imagen. Por favor intenta de nuevo.");
            }
        }
    };

    const handlePortfolioImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                const newPortfolio = [...portfolioImages];
                newPortfolio[index] = compressedImage;
                setPortfolioImages(newPortfolio);
            } catch (error) {
                console.error("Error compressing portfolio image:", error);
                alert("Error al procesar la imagen. Por favor intenta de nuevo.");
            }
        }
    };

    const handleAddBarber = async () => {
        if (!newName || !newRole || !newImage) return;
        setIsSubmitting(true);
        try {
            await addBarber({
                name: newName,
                role: newRole,
                imageUrl: newImage,
                socials: { whatsapp: newWhatsapp || '', instagram: newInstagram || '', tiktok: newTiktok || '' },
                portfolioImages: portfolioImages.filter(img => img !== "")
            });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding barber:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-[420px] max-h-[85vh] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                            backdropFilter: 'blur(45px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                        {/* Header */}
                        <div className="pt-8 px-8 pb-4">
                            <h2 className="text-xl font-bold tracking-tight text-white">Nuevo Barbero</h2>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-2 overflow-y-auto max-h-[calc(85vh-200px)] space-y-4">
                            {/* Photo Upload */}
                            <div className="flex justify-center py-4">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className={`w-24 h-24 rounded-full overflow-hidden border-2 transition-all duration-300 ${newImage ? 'border-[#E5B454]' : 'border-dashed border-white/20 group-hover:border-white/40 bg-black/20'}`}>
                                        {newImage ? (
                                            <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-1">
                                                <Scissors size={20} />
                                                <span className="text-[9px] uppercase font-bold">Foto</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-[#E5B454] p-1.5 rounded-full text-black shadow-lg hover:scale-110 transition-transform border border-white/20">
                                        <Plus size={14} />
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Nombre <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Ej. Pedro Gómez"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Rol <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        placeholder="Ej. Senior Barber"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>

                                {/* Socials */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1 block">Redes Sociales (Opcional)</label>

                                    {/* Instagram */}
                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-white/30 group-hover:text-[#E5B454] transition-colors">
                                            <Instagram size={14} />
                                        </div>
                                        <input
                                            value={newInstagram}
                                            onChange={(e) => setNewInstagram(e.target.value)}
                                            placeholder="Instagram User"
                                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20 w-full"
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-white/30 group-hover:text-[#E5B454] transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        </div>
                                        <input
                                            value={newWhatsapp}
                                            onChange={(e) => setNewWhatsapp(e.target.value)}
                                            placeholder="WhatsApp Link"
                                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20 w-full"
                                        />
                                    </div>

                                    {/* TikTok */}
                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-white/30 group-hover:text-[#E5B454] transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                            </svg>
                                        </div>
                                        <input
                                            value={newTiktok}
                                            onChange={(e) => setNewTiktok(e.target.value)}
                                            placeholder="TikTok Link"
                                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20 w-full"
                                        />
                                    </div>
                                </div>

                                {/* Portfolio Images */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1 block">Portafolio (Opcional - Máx 6 fotos)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {portfolioImages.map((img, index) => (
                                            <div
                                                key={index}
                                                onClick={() => portfolioInputRefs.current[index]?.click()}
                                                className="aspect-square relative rounded-xl overflow-hidden border border-white/10 hover:border-[#E5B454]/50 transition-all cursor-pointer group bg-white/5"
                                            >
                                                {img ? (
                                                    <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                                                        <ImageIcon size={16} />
                                                        <span className="text-[8px] uppercase font-bold mt-1">{index + 1}</span>
                                                    </div>
                                                )}
                                                <input
                                                    ref={(el) => { portfolioInputRefs.current[index] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePortfolioImageChange(index, e)}
                                                    className="hidden"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 pt-4 flex gap-3">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-12 rounded-2xl font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddBarber}
                                disabled={!newName || !newRole || !newImage || isSubmitting}
                                className="flex-[1.5] h-12 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={(!newName || !newRole || !newImage) ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' } : {
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 10px 25px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                    color: '#000'
                                }}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
