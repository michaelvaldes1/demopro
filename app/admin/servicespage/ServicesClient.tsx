'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Plus, Scissors, RefreshCw, Trash2, Search, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { addService, updateService, deleteService } from '../actions';
import { Service } from './Types';
import { ServicesProvider } from './ServicesContext';

const CATEGORIES = [
    'Corte de Cabello',
    'Arreglo de Barba',
    'Facial',
    'Otros'
];

interface ServicesClientProps {
    children: React.ReactNode;
}

export default function ServicesClient({ children }: ServicesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Filters state
    const [filterValue, setFilterValue] = useState(searchParams.get('q') || "");
    const selectedCategory = searchParams.get('category') || "Todos";

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [activeServiceForDropdown, setActiveServiceForDropdown] = useState<Service | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

    // Form state
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDuration, setNewDuration] = useState("45");
    const [newCategory, setNewCategory] = useState("Corte de Cabello");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAddOpen) {
            setNewName(""); setNewDescription(""); setNewPrice("");
            setNewDuration("45"); setNewCategory("Corte de Cabello");
            setNewImageUrl("");
        }
    }, [isAddOpen]);

    useEffect(() => {
        if (isEditOpen && serviceToEdit) {
            setNewName(serviceToEdit.name || "");
            setNewDescription(serviceToEdit.description || "");
            setNewPrice(serviceToEdit.price?.toString() || "");
            setNewDuration(serviceToEdit.duration || "45");
            setNewCategory(serviceToEdit.category || "Corte de Cabello");
            setNewImageUrl(serviceToEdit.imageUrl || "");
        }
    }, [isEditOpen, serviceToEdit]);

    const handleSearch = (val: string) => {
        setFilterValue(val);
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (val) params.set('q', val);
            else params.delete('q');
            router.push(`/admin/servicespage?${params.toString()}`);
        });
    };

    const handleCategoryChange = (cat: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (cat === "Todos") params.delete('category');
            else params.set('category', cat);
            router.push(`/admin/servicespage?${params.toString()}`);
        });
    };

    const handleAddService = async () => {
        if (!newName || !newPrice || !newDuration || !newCategory) return;
        setIsSubmitting(true);
        try {
            await addService({
                name: newName,
                description: newDescription,
                price: parseFloat(newPrice),
                duration: newDuration,
                category: newCategory,
                imageUrl: newImageUrl
            });
            router.refresh();
            setIsAddOpen(false);
        } catch (error) {
            console.error("Error adding service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateService = async () => {
        if (!newName || !newPrice || !newDuration || !newCategory || !serviceToEdit) return;
        setIsSubmitting(true);
        try {
            await updateService(serviceToEdit.id, {
                name: newName,
                description: newDescription,
                price: parseFloat(newPrice),
                duration: newDuration,
                category: newCategory,
                imageUrl: newImageUrl
            });
            router.refresh();
            setIsEditOpen(false);
            setServiceToEdit(null);
        } catch (error) {
            console.error("Error updating service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDeleteService = async () => {
        if (!serviceToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteService(serviceToDelete.id);
            router.refresh();
            setIsDeleteOpen(false);
            setServiceToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ServicesProvider actions={{
            openEditModal: (s) => { setServiceToEdit(s); setIsEditOpen(true); },
            openDeleteModal: (s) => { setServiceToDelete(s); setIsDeleteOpen(true); },
            openDropdown: (s, pos) => {
                setDropdownPosition(pos);
                setActiveServiceForDropdown(activeServiceForDropdown?.id === s.id ? null : s);
            }
        }}>
            <div className="pb-10 px-4 md:px-8 pt-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 px-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
                            <Scissors className="text-[#E5B454]" size={32} />
                            SERVICIOS
                        </h1>
                        <p className="text-white/40 text-sm mt-2 font-medium tracking-wide uppercase pl-1">
                            Gestión de Servicios
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.refresh()}
                            className="w-[50px] h-[50px] flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/20 hover:text-white text-white/50 rounded-2xl transition-all shadow-lg active:scale-95 backdrop-blur-md group"
                        >
                            <RefreshCw size={20} className={`group-hover:rotate-180 transition-transform duration-700 ${isPending ? "animate-spin text-[#E5B454]" : ""}`} />
                        </button>

                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-2 px-6 h-[50px] rounded-2xl font-bold text-black shadow-lg uppercase tracking-wider text-xs transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                boxShadow: '0 8px 20px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                            }}
                        >
                            <Plus size={18} />
                            Nuevo Servicio
                        </button>
                    </div>
                </div>

                <div
                    className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        backdropFilter: 'blur(40px)',
                    }}
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="relative w-full max-w-sm group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-[#E5B454] transition-colors">
                                <Scissors size={18} />
                            </div>
                            <input
                                type="text"
                                value={filterValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="BUSCAR SERVICIO..."
                                className="w-full pl-12 pr-10 py-3 bg-black/20 border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-black/40 focus:border-[#E5B454]/30 transition-all uppercase tracking-wider font-bold shadow-inner"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            {['Todos', ...CATEGORIES].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-[#E5B454] text-black'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative min-h-[400px]">
                        {children}
                    </div>
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {isAddOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsAddOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="relative w-full max-w-[420px] max-h-[85vh] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden"
                            >
                                <div className="p-8 border-b border-white/5"><h2 className="text-xl font-bold text-white">Nuevo Servicio</h2></div>
                                <div className="p-8 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Nombre <span className="text-[#E5B454]">*</span></label>
                                        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. The Urban Fade" className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Descripción</label>
                                        <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Describe el servicio..." className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner min-h-[100px] resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Precio ($) <span className="text-[#E5B454]">*</span></label>
                                            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="35" className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Duración <span className="text-[#E5B454]">*</span></label>
                                            <input value={newDuration} onChange={(e) => setNewDuration(e.target.value)} placeholder="45 min" className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Categoría <span className="text-[#E5B454]">*</span></label>
                                        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner">
                                            {CATEGORIES.map((cat) => (<option key={cat} value={cat} className="bg-zinc-900">{cat}</option>))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">URL de Imagen</label>
                                        <input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner" />
                                    </div>
                                </div>
                                <div className="p-8 border-t border-white/5 flex gap-3">
                                    <button onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-2xl font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancelar</button>
                                    <button onClick={handleAddService} disabled={!newName || !newPrice || !newDuration || !newCategory || isSubmitting} className="flex-[1.5] h-12 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 text-black" style={{ background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)' }}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isEditOpen && serviceToEdit && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsEditOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="relative w-full max-w-[420px] max-h-[85vh] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden"
                            >
                                <div className="p-8 border-b border-white/5"><h2 className="text-xl font-bold text-white">Editar Servicio</h2></div>
                                <div className="p-8 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Nombre <span className="text-[#E5B454]">*</span></label><input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none" /></div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Descripción</label><textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm min-h-[100px] resize-none" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Precio ($) <span className="text-[#E5B454]">*</span></label><input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm" /></div>
                                        <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Duración <span className="text-[#E5B454]">*</span></label><input value={newDuration} onChange={(e) => setNewDuration(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm" /></div>
                                    </div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Categoría <span className="text-[#E5B454]">*</span></label><select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm">{CATEGORIES.map((cat) => (<option key={cat} value={cat} className="bg-zinc-900">{cat}</option>))}</select></div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">URL de Imagen</label><input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none" /></div>
                                </div>
                                <div className="p-8 border-t border-white/5 flex gap-3">
                                    <button onClick={() => setIsEditOpen(false)} className="flex-1 h-12 rounded-2xl font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancelar</button>
                                    <button onClick={handleUpdateService} disabled={!newName || !newPrice || !newDuration || !newCategory || isSubmitting} className="flex-[1.5] h-12 rounded-2xl font-bold transition-all text-black" style={{ background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)' }}>{isSubmitting ? 'Actualizando...' : 'Actualizar'}</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isDeleteOpen && serviceToDelete && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsDeleteOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="relative w-full max-w-[360px] bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8"
                            >
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500"><Trash2 size={32} /></div>
                                    <h2 className="text-xl font-bold text-white">¿Eliminar servicio?</h2>
                                    <p className="text-white/50">Esta acción no se puede deshacer. Se eliminará el servicio <span className="text-white font-bold">{serviceToDelete.name}</span>.</p>
                                    <div className="flex gap-3 w-full mt-4">
                                        <button onClick={() => setIsDeleteOpen(false)} className="flex-1 h-12 rounded-2xl bg-white/5 text-white/50 font-bold hover:bg-white/10 transition-all">Cancelar</button>
                                        <button onClick={confirmDeleteService} disabled={isSubmitting} className="flex-1 h-12 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all">{isSubmitting ? 'Eliminando...' : 'Eliminar'}</button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                {/* Action Dropdown (Root Level) */}
                <AnimatePresence>
                    {activeServiceForDropdown && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveServiceForDropdown(null);
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="fixed z-[70] w-40 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-1 shadow-black"
                                style={{
                                    left: `${Math.min(dropdownPosition.x - 160, typeof window !== 'undefined' ? window.innerWidth - 170 : 0)}px`,
                                    top: `${dropdownPosition.y + 8}px`
                                }}
                            >
                                <button
                                    onClick={() => {
                                        setServiceToEdit(activeServiceForDropdown);
                                        setIsEditOpen(true);
                                        setActiveServiceForDropdown(null);
                                    }}
                                    className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        setServiceToDelete(activeServiceForDropdown);
                                        setIsDeleteOpen(true);
                                        setActiveServiceForDropdown(null);
                                    }}
                                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium outline-none"
                                >
                                    Eliminar
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </ServicesProvider>
    );
}
