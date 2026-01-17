'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Trash2, MoreVertical, Scissors, RefreshCw, Instagram } from 'lucide-react';
import { Avatar } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteBarber, getBarbers, toggleBarberStatus } from '../../actions';
import EditBarberModal from './EditBarberModal';
import AddBarberModal from './AddBarberModal';

const columns = [
    { name: "BARBERO", uid: "name" },
    { name: "ROL", uid: "role" },
    { name: "REDES", uid: "socials" },
    { name: "ESTADO", uid: "status" },
    { name: "ACCIONES", uid: "actions" },
];

export default function BarbersClient({ initialBarbers }: { initialBarbers: any[] }) {
    const [barbers, setBarbers] = useState<any[]>(initialBarbers);
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState("");

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [activeBarberForDropdown, setActiveBarberForDropdown] = useState<any | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

    const [barberToDelete, setBarberToDelete] = useState<any>(null);
    const [barberToEdit, setBarberToEdit] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadBarbers = async () => {
        setLoading(true);
        try {
            const data = await getBarbers();
            setBarbers(data);
        } catch (error) {
            console.error("Failed to load barbers", error);
        } finally {
            setLoading(false);
        }
    };



    const openDeleteModal = (barber: any) => {
        setBarberToDelete(barber);
        setIsDeleteOpen(true);
        setActiveBarberForDropdown(null);
    };

    const openEditModal = (barber: any) => {
        setBarberToEdit(barber);
        setIsEditOpen(true);
        setActiveBarberForDropdown(null);
    };

    const handleBarberUpdated = async () => {
        await loadBarbers();
        setIsEditOpen(false);
    };

    const handleToggleStatus = async (barber: any) => {
        setLoading(true);
        try {
            await toggleBarberStatus(barber.id, barber.isAvailable);
            await loadBarbers();
        } catch (error) {
            console.error("Error toggling barber status:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteBarber = async () => {
        if (!barberToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteBarber(barberToDelete.id);
            await loadBarbers();
            setIsDeleteOpen(false);
            setBarberToDelete(null);
        } catch (error) {
            console.error("Error deleting barber:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredItems = barbers.filter((barber) =>
        barber.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        barber.role.toLowerCase().includes(filterValue.toLowerCase())
    );

    const renderCell = (barber: any, columnKey: string) => {
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center gap-4 py-1">
                        <div className="relative group flex-shrink-0 p-0.5 rounded-full border border-white/10 bg-white/5">
                            <Avatar
                                src={barber.imageUrl || undefined}
                                name={barber.name?.split(' ').map((n: string) => n[0]).join('') || "B"}
                                className="w-12 h-12"
                                isBordered
                                imgProps={{
                                    referrerPolicy: "no-referrer",
                                    className: "object-cover"
                                }}
                                classNames={{
                                    base: "bg-zinc-900 ring-2 ring-[#E5B454]/30",
                                    name: "text-[#E5B454] font-bold"
                                }}
                            />
                        </div>
                        <span className="text-white font-bold text-sm tracking-tight">{barber.name}</span>
                    </div>
                );
            case "role":
                return (
                    <div className="inline-flex px-3 py-1 rounded-lg border bg-white/5 border-white/10 text-zinc-300 backdrop-blur-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest">{barber.role}</p>
                    </div>
                );
            case "socials":
                return (
                    <div className="flex gap-1.5">
                        {barber.socials?.instagram && (
                            <div className="p-1.5 bg-white/5 rounded-full text-zinc-400 border border-white/5">
                                <Instagram size={12} />
                            </div>
                        )}
                        {barber.socials?.whatsapp && (
                            <div className="p-1.5 bg-white/5 rounded-full text-zinc-400 border border-white/5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                        )}
                        {barber.socials?.tiktok && (
                            <div className="p-1.5 bg-white/5 rounded-full text-zinc-400 border border-white/5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </div>
                        )}
                        {(!barber.socials?.instagram && !barber.socials?.whatsapp && !barber.socials?.tiktok) && (
                            <span className="text-zinc-600 text-[10px] font-bold">SIN REDES</span>
                        )}
                    </div>
                );
            case "status":
                const isActive = barber.isAvailable ?? true;
                return (
                    <div className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                        {isActive ? 'Activo' : 'Inactivo'}
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownPosition({ x: rect.right, y: rect.bottom });
                                setActiveBarberForDropdown(activeBarberForDropdown?.id === barber.id ? null : barber);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95"
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                );
            default:
                return barber[columnKey];
        }
    };

    return (
        <div className="pb-10 px-4 md:px-8 pt-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 px-4 md:px-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-3">
                        <Scissors className="text-[#E5B454]" size={32} />
                        EQUIPO
                    </h1>
                    <p className="text-white/40 text-sm mt-2 font-medium tracking-wide uppercase pl-1">
                        Gestión de Barberos Profesionales
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadBarbers}
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
                        Nuevo Barbero
                    </button>
                </div>
            </div>

            {/* Main Content Pane - Liquid Glass */}
            <div
                className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500"
                style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    backdropFilter: 'blur(40px)',
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 flex items-center">
                    <div className="relative w-full max-w-sm group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-[#E5B454] transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="BUSCAR BARBERO..."
                            className="w-full pl-12 pr-10 py-3 bg-black/20 border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-black/40 focus:border-[#E5B454]/30 transition-all uppercase tracking-wider font-bold shadow-inner"
                        />
                        {filterValue && (
                            <button
                                onClick={() => setFilterValue('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                <div className="bg-white/10 rounded-full p-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Wrapper */}
                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-[#E5B454] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="min-w-[800px]">
                            <table className="w-full">
                                <thead className="bg-black/20 border-b border-white/5">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.uid}
                                                className={`text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] h-14 text-left first:pl-8 last:pr-8 ${column.uid === 'name' ? 'w-[40%]' : ''
                                                    } ${column.uid === "actions" ? 'text-right' : ''}`}
                                            >
                                                {column.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-4 text-white/30">
                                                    <Scissors size={48} strokeWidth={1} />
                                                    <p className="text-sm font-medium">No hay barberos registrados</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredItems.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-white/[0.02] transition-colors duration-200 group ${index === filteredItems.length - 1 ? '' : 'border-b border-white/5'
                                                    }`}
                                            >
                                                {columns.map((column) => (
                                                    <td
                                                        key={column.uid}
                                                        className={`py-4 first:pl-8 last:pr-8 ${column.uid === "actions" ? 'text-right' : ''
                                                            }`}
                                                    >
                                                        {renderCell(item, column.uid)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Barber Modal */}
            <AddBarberModal
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSuccess={loadBarbers}
            />

            {/* Edit Barber Modal */}
            {barberToEdit && (
                <EditBarberModal
                    isOpen={isEditOpen}
                    onOpenChange={(open) => setIsEditOpen(open)}
                    barber={barberToEdit}
                    onUpdate={handleBarberUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteOpen && (
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
                            className="relative max-w-[360px] w-[90%] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                backdropFilter: 'blur(45px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                            {/* Header */}
                            <div className="pt-8 px-6 pb-2 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <Trash2 size={28} />
                                </div>
                                <h2 className="text-lg font-bold text-white">Eliminar Barbero</h2>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4 text-center">
                                <p className="text-white/50 text-sm leading-relaxed">
                                    ¿Estás seguro de eliminar a <span className="text-white font-bold">{barberToDelete?.name}</span>?
                                    <br />Esta acción <span className="text-red-400">no se puede deshacer</span>.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-8 pt-2 flex gap-3">
                                <button
                                    onClick={() => setIsDeleteOpen(false)}
                                    className="flex-1 bg-white/5 text-white/50 hover:text-white rounded-2xl h-12 font-bold hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteBarber}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl h-12 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Action Dropdown (Root Level to avoid stacking context issues) */}
            <AnimatePresence>
                {activeBarberForDropdown && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveBarberForDropdown(null);
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
                                    handleToggleStatus(activeBarberForDropdown);
                                    setActiveBarberForDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${activeBarberForDropdown.isAvailable ? 'text-orange-400 hover:bg-orange-500/10' : 'text-green-400 hover:bg-green-500/10'
                                    }`}
                            >
                                {activeBarberForDropdown.isAvailable ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                                onClick={() => {
                                    openEditModal(activeBarberForDropdown);
                                    setActiveBarberForDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-colors text-sm"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => {
                                    openDeleteModal(activeBarberForDropdown);
                                    setActiveBarberForDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm flex items-center gap-2"
                            >
                                <Trash2 size={14} />
                                Eliminar
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
