'use client';

import React, { useEffect, useState } from 'react';
import { Scissors, Plus, Trash2, MoreVertical, RefreshCw, DollarSign, Clock } from 'lucide-react';
import { Spinner } from '@heroui/react';
import { getServices, addService, updateService, deleteService } from '../actions';
import { Service } from './Types';

const CATEGORIES = [
    'Corte de Cabello',
    'Arreglo de Barba',
    'Facial',
    'Otros'
];

interface ServicesClientProps {
    initialServices: Service[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

    // Form state
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDuration, setNewDuration] = useState("45");
    const [newCategory, setNewCategory] = useState("Corte de Cabello");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAddOpen) {
            setNewName(""); setNewDescription(""); setNewPrice("");
            setNewDuration("45"); setNewCategory("Corte de Cabello");
        }
    }, [isAddOpen]);

    useEffect(() => {
        if (isEditOpen && serviceToEdit) {
            setNewName(serviceToEdit.name || "");
            setNewDescription(serviceToEdit.description || "");
            setNewPrice(serviceToEdit.price?.toString() || "");
            setNewDuration(serviceToEdit.duration || "45");
            setNewCategory(serviceToEdit.category || "Corte de Cabello");
        }
    }, [isEditOpen, serviceToEdit]);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to load services", error);
        } finally {
            setLoading(false);
        }
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
                category: newCategory
            });
            await loadServices();
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
                category: newCategory
            });
            await loadServices();
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
            await loadServices();
            setIsDeleteOpen(false);
            setServiceToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = (service: Service) => {
        setServiceToDelete(service);
        setIsDeleteOpen(true);
        setDropdownOpen(null);
    };

    const openEditModal = (service: Service) => {
        setServiceToEdit(service);
        setIsEditOpen(true);
        setDropdownOpen(null);
    };

    const filteredServices = services.filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            service.description?.toLowerCase().includes(filterValue.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pb-10 px-4 md:px-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
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
                        onClick={loadServices}
                        className="w-[50px] h-[50px] flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/20 hover:text-white text-white/50 rounded-2xl transition-all shadow-lg active:scale-95 backdrop-blur-md group"
                    >
                        <RefreshCw size={20} className={`group-hover:rotate-180 transition-transform duration-700 ${loading ? "animate-spin text-[#E5B454]" : ""}`} />
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

            {/* Main Content */}
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
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="BUSCAR SERVICIO..."
                            className="w-full pl-12 pr-10 py-3 bg-black/20 border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-black/40 focus:border-[#E5B454]/30 transition-all uppercase tracking-wider font-bold shadow-inner"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                        {['Todos', ...CATEGORIES].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
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

                {/* Services List */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner size="lg" color="warning" />
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-white/30 py-20 text-center">
                            <Scissors size={48} strokeWidth={1} className="mx-auto mb-4" />
                            <p className="text-sm font-medium">No hay servicios registrados</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredServices.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-base">{service.name}</h3>
                                        <p className="text-white/50 text-sm mt-1">{service.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="inline-flex items-center gap-1 text-[#E5B454] text-xs font-bold">
                                                <DollarSign size={14} />
                                                {service.price}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-white/40 text-xs font-bold">
                                                <Clock size={14} />
                                                {service.duration}
                                            </span>
                                            <span className="px-2 py-1 bg-white/5 rounded-lg text-white/40 text-[10px] font-bold uppercase">
                                                {service.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setDropdownPosition({
                                                    x: rect.right,
                                                    y: rect.bottom
                                                });
                                                setDropdownOpen(dropdownOpen === service.id ? null : service.id);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown Menu - Rendered outside table container */}
            {dropdownOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(null)}
                    />
                    <div
                        className="fixed w-48 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        style={{
                            left: `${dropdownPosition.x - 192}px`,
                            top: `${dropdownPosition.y + 8}px`
                        }}
                    >
                        <button
                            onClick={() => {
                                const service = filteredServices.find(s => s.id === dropdownOpen);
                                if (service) openEditModal(service);
                            }}
                            className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => {
                                const service = filteredServices.find(s => s.id === dropdownOpen);
                                if (service) openDeleteModal(service);
                            }}
                            className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                </>
            )}

            {/* Add Service Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsAddOpen(false)}
                    />
                    <div className="relative w-full max-w-[420px] max-h-[85vh] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                        <div className="p-8 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white">Nuevo Servicio</h2>
                        </div>

                        <div className="p-8 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Nombre <span className="text-[#E5B454]">*</span></label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ej. The Urban Fade"
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Descripción</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Describe el servicio..."
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Precio ($) <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        placeholder="35"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Duración <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        value={newDuration}
                                        onChange={(e) => setNewDuration(e.target.value)}
                                        placeholder="45 min"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Categoría <span className="text-[#E5B454]">*</span></label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="flex-1 h-12 rounded-2xl font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddService}
                                disabled={!newName || !newPrice || !newDuration || !newCategory || isSubmitting}
                                className="flex-[1.5] h-12 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={(!newName || !newPrice || !newDuration || !newCategory) ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' } : {
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 10px 25px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                    color: '#000'
                                }}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {isEditOpen && serviceToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsEditOpen(false)}
                    />
                    <div className="relative w-full max-w-[420px] max-h-[85vh] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                        <div className="p-8 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white">Editar Servicio</h2>
                        </div>

                        <div className="p-8 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Nombre <span className="text-[#E5B454]">*</span></label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ej. The Urban Fade"
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Descripción</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Describe el servicio..."
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Precio ($) <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        placeholder="35"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Duración <span className="text-[#E5B454]">*</span></label>
                                    <input
                                        value={newDuration}
                                        onChange={(e) => setNewDuration(e.target.value)}
                                        placeholder="45 min"
                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider ml-1">Categoría <span className="text-[#E5B454]">*</span></label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:bg-white/10 focus:border-[#E5B454]/50 transition-all shadow-inner"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 h-12 rounded-2xl font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateService}
                                disabled={!newName || !newPrice || !newDuration || !newCategory || isSubmitting}
                                className="flex-[1.5] h-12 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={(!newName || !newPrice || !newDuration || !newCategory) ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' } : {
                                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                    boxShadow: '0 10px 25px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                    color: '#000'
                                }}
                            >
                                {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteOpen && serviceToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsDeleteOpen(false)}
                    />
                    <div className="relative w-full max-w-[360px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-[45px] border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                        <div className="p-8 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                <Trash2 size={28} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Eliminar Servicio</h2>
                        </div>

                        <div className="px-6 py-4 text-center">
                            <p className="text-white/50 text-sm leading-relaxed">
                                ¿Estás seguro de eliminar <span className="text-white font-bold">{serviceToDelete.name}</span>?
                                <br />Esta acción <span className="text-red-400">no se puede deshacer</span>.
                            </p>
                        </div>

                        <div className="p-8 flex gap-3">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 bg-white/5 text-white/50 hover:text-white rounded-2xl h-12 font-bold hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteService}
                                disabled={isSubmitting}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl h-12 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                            >
                                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}