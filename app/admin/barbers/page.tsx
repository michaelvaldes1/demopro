'use client';

import React, { useEffect, useState } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    User, Avatar, Button, Input, Modal, ModalContent, ModalHeader,
    ModalBody, ModalFooter, useDisclosure, Spinner, Dropdown,
    DropdownTrigger, DropdownMenu, DropdownItem
} from "@heroui/react";
import { Search, Plus, Trash2, MoreVertical, Scissors, RefreshCw } from 'lucide-react';
import { getBarbers, addBarber, updateBarber, deleteBarber } from '../actions';
import EditBarberModal from './components/EditBarberModal';

const columns = [
    { name: "BARBERO", uid: "name" },
    { name: "ROL", uid: "role" },
    { name: "ACCIONES", uid: "actions" },
];

export default function BarbersPage() {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const [barberToDelete, setBarberToDelete] = useState<any>(null);
    const [barberToEdit, setBarberToEdit] = useState<any>(null);

    // Form state
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newInstagram, setNewInstagram] = useState("");
    const [newWhatsapp, setNewWhatsapp] = useState("");
    const [newTiktok, setNewTiktok] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

    // Clear inputs when add modal closes
    useEffect(() => {
        if (!isAddOpen) {
            setNewName("");
            setNewRole("");
            setNewImage("");
            setNewInstagram("");
            setNewWhatsapp("");
            setNewTiktok("");
        }
    }, [isAddOpen]);

    // Populate inputs when edit modal opens
    useEffect(() => {
        if (isEditOpen && barberToEdit) {
            setNewName(barberToEdit.name || "");
            setNewRole(barberToEdit.role || "");
            setNewImage(barberToEdit.imageUrl || "");
            setNewInstagram(barberToEdit.instagram || "");
            setNewWhatsapp(barberToEdit.whatsapp || "");
            setNewTiktok(barberToEdit.tiktok || "");
        } else if (!isEditOpen) {
            setBarberToEdit(null);
        }
    }, [isEditOpen, barberToEdit]);

    useEffect(() => {
        loadBarbers();
    }, []);

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

    const handleAddBarber = async (onClose: () => void) => {
        if (!newName || !newRole || !newImage) return;

        setIsSubmitting(true);
        try {
            await addBarber({
                name: newName,
                role: newRole,
                imageUrl: newImage,
                socials: {
                    whatsapp: newWhatsapp || '',
                    instagram: newInstagram || '',
                    tiktok: newTiktok || ''
                }
            });
            await loadBarbers();
            setNewName("");
            setNewRole("");
            setNewImage("");
            setNewInstagram("");
            setNewWhatsapp("");
            setNewTiktok("");
            onClose();
        } catch (error) {
            console.error("Error adding barber:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert("La imagen es demasiado grande. Por favor elige una de menos de 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openDeleteModal = (barber: any) => {
        setBarberToDelete(barber);
        onDeleteOpen();
    };

    const openEditModal = (barber: any) => {
        setBarberToEdit(barber);
        onEditOpen();
    };

    const handleUpdateBarber = async (onClose: () => void) => {
        if (!newName || !newRole || !newImage || !barberToEdit) return;

        setIsSubmitting(true);
        try {
            await updateBarber(barberToEdit.id, {
                name: newName,
                role: newRole,
                imageUrl: newImage,
                instagram: newInstagram || '',
                whatsapp: newWhatsapp || '',
                tiktok: newTiktok || ''
            });
            await loadBarbers();
            onClose();
        } catch (error) {
            console.error("Error updating barber:", error);
            alert("Error al actualizar el barbero. Por favor intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDeleteBarber = async (onClose: () => void) => {
        if (!barberToDelete) return;

        setIsSubmitting(true);
        try {
            await deleteBarber(barberToDelete.id);
            await loadBarbers();
            onClose();
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

    const renderCell = (barber: any, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D09E1E]/30 flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                            {barber.imageUrl ? (
                                <img
                                    src={barber.imageUrl}
                                    alt={barber.name}
                                    className="w-full h-full object-cover opacity-100 block"
                                />
                            ) : (
                                <span className="text-[10px] text-[#D09E1E] font-bold">
                                    {barber.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <span className="text-zinc-100 font-semibold">{barber.name}</span>
                    </div>
                );
            case "role":
                return (
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-zinc-300 font-medium">{barber.role}</span>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly variant="light" size="sm" className="text-zinc-400 hover:text-zinc-100">
                                    <MoreVertical size={20} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Acciones de barbero">
                                <DropdownItem
                                    key="edit"
                                    onPress={() => openEditModal(barber)}
                                >
                                    Editar
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<Trash2 size={16} />}
                                    onPress={() => openDeleteModal(barber)}
                                >
                                    Eliminar Barbero
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return barber[columnKey as keyof typeof barber];
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <Scissors className="text-[#D09E1E]" />
                            Gestión de Barberos
                        </h1>
                        <p className="text-zinc-400 mt-1">Administra tu equipo de barberos profesionales.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Refresh Button */}
                        <button
                            type="button"
                            onClick={loadBarbers}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 rounded-lg transition-colors"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>

                        {/* Add Barber Button */}
                        <button
                            type="button"
                            onClick={onAddOpen}
                            className="flex items-center gap-2 bg-[#D09E1E] hover:bg-[#b8891a] text-black font-bold h-12 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(208,158,30,0.39)] hover:shadow-[0_6px_20px_0_rgba(208,158,30,0.5)] uppercase tracking-wider transition-all duration-300"
                        >
                            <Plus size={20} />
                            Nuevo Barbero
                        </button>
                    </div>
                </div>

                {/* Filter & Table Container */}
                <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 overflow-hidden">
                    {/* Search Input */}
                    <div className="w-full sm:max-w-[44%] mb-6">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Search className="text-zinc-400" size={18} />
                            </div>
                            <input
                                type="text"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                placeholder="Buscar por nombre o rol..."
                                className="w-full pl-10 pr-10 py-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E]/50 focus:border-transparent transition-all"
                            />
                            {filterValue && (
                                <button
                                    type="button"
                                    onClick={() => setFilterValue('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto no-scrollbar">
                        <div className="min-w-[600px]">
                            <table className="w-full">
                                {/* Table Header */}
                                <thead className="bg-zinc-950/50 border-b border-zinc-800">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.uid}
                                                className={`text-zinc-400 font-bold text-[11px] uppercase tracking-wider py-4 px-4 ${column.uid === "actions" ? "text-right" :
                                                    column.uid === "role" ? "text-center" :
                                                        "text-left"
                                                    }`}
                                            >
                                                {column.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-12">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-[#D09E1E] border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-12 text-zinc-500">
                                                No se encontraron barberos.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all duration-300"
                                            >
                                                {columns.map((column) => (
                                                    <td
                                                        key={column.uid}
                                                        className={`py-4 px-4 ${column.uid === "actions" ? "text-right" :
                                                            column.uid === "role" ? "text-center" :
                                                                "text-left"
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
                    </div>

                </div>
            </div>

            {/* Add Barber Modal */}
            <Modal
                isOpen={isAddOpen}
                onOpenChange={onAddOpenChange}
                backdrop="blur"
                hideCloseButton
                classNames={{
                    base: "bg-zinc-950 border border-zinc-800",
                    header: "text-white border-b border-zinc-900",
                    footer: "border-t border-zinc-900"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold">Agregar Nuevo Barbero</ModalHeader>
                            <ModalBody className="py-6 flex flex-col gap-5">
                                <div className="flex flex-col items-center gap-4 mb-2">
                                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden">
                                        {newImage ? (
                                            <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Scissors className="w-10 h-10 text-zinc-600" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${!newImage ? 'bg-zinc-800 text-[#D09E1E] border border-[#D09E1E]/30' : 'bg-zinc-800 text-zinc-300'}`}
                                    >
                                        {newImage ? "Cambiar Foto" : "Subir Foto (Obligatorio)"}
                                    </button>
                                </div>

                                {/* Nombre Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-name" className="block text-sm font-medium text-zinc-300">
                                        Nombre <span className="text-[#D09E1E]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-name"
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Ej. Pedro Gómez"
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newName && (
                                            <button
                                                type="button"
                                                onClick={() => setNewName('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Rol Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-role" className="block text-sm font-medium text-zinc-300">
                                        Rol <span className="text-[#D09E1E]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-role"
                                            type="text"
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            placeholder="Ej. Especialista en cortes modernos"
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newRole && (
                                            <button
                                                type="button"
                                                onClick={() => setNewRole('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* URL de Imagen Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-image" className="block text-sm font-medium text-zinc-300">
                                        URL de Imagen <span className="text-zinc-600 text-xs">(Opcional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-image"
                                            type="url"
                                            value={newImage}
                                            onChange={(e) => setNewImage(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newImage && (
                                            <button
                                                type="button"
                                                onClick={() => setNewImage('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* WhatsApp Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-whatsapp" className="block text-sm font-medium text-zinc-300">
                                        WhatsApp <span className="text-zinc-600 text-xs">(Opcional - Ej. https://wa.me/...)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-whatsapp"
                                            type="url"
                                            value={newWhatsapp}
                                            onChange={(e) => setNewWhatsapp(e.target.value)}
                                            placeholder="https://wa.me/..."
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newWhatsapp && (
                                            <button
                                                type="button"
                                                onClick={() => setNewWhatsapp('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Instagram Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-instagram" className="block text-sm font-medium text-zinc-300">
                                        Instagram <span className="text-zinc-600 text-xs">(Opcional - Ej. https://instagram.com/...)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-instagram"
                                            type="url"
                                            value={newInstagram}
                                            onChange={(e) => setNewInstagram(e.target.value)}
                                            placeholder="https://instagram.com/..."
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newInstagram && (
                                            <button
                                                type="button"
                                                onClick={() => setNewInstagram('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* TikTok Input */}
                                <div className="space-y-2">
                                    <label htmlFor="barber-tiktok" className="block text-sm font-medium text-zinc-300">
                                        TikTok <span className="text-zinc-600 text-xs">(Opcional - Ej. https://tiktok.com/@...)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="barber-tiktok"
                                            type="url"
                                            value={newTiktok}
                                            onChange={(e) => setNewTiktok(e.target.value)}
                                            placeholder="https://tiktok.com/@..."
                                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D09E1E] focus:border-transparent transition-all"
                                        />
                                        {newTiktok && (
                                            <button
                                                type="button"
                                                onClick={() => setNewTiktok('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="text-zinc-400 hover:text-white font-medium"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleAddBarber(onClose)}
                                    isLoading={isSubmitting}
                                    isDisabled={!newName || !newRole || !newImage}
                                    className={`font-bold ${(!newName || !newRole || !newImage) ? 'bg-zinc-800 text-zinc-500' : 'bg-[#D09E1E] text-black hover:bg-[#b8891a]'}`}
                                >
                                    Guardar Barbero
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit Barber Modal */}
            <EditBarberModal
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                barber={barberToEdit}
                name={newName}
                role={newRole}
                image={newImage}
                whatsapp={newWhatsapp}
                instagram={newInstagram}
                tiktok={newTiktok}
                onNameChange={setNewName}
                onRoleChange={setNewRole}
                onImageChange={setNewImage}
                onWhatsappChange={setNewWhatsapp}
                onInstagramChange={setNewInstagram}
                onTiktokChange={setNewTiktok}
                onFileChange={handleFileChange}
                onUpdate={handleUpdateBarber}
                isSubmitting={isSubmitting}
                fileInputRef={fileInputRef}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                backdrop="blur"
                classNames={{
                    base: "bg-zinc-950 border border-zinc-800",
                    header: "text-white border-b border-zinc-900",
                    footer: "border-t border-zinc-900"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmar Eliminación</ModalHeader>
                            <ModalBody className="py-6">
                                <p className="text-zinc-300">
                                    ¿Estás seguro de que deseas eliminar a <span className="font-bold text-white">{barberToDelete?.name}</span>?
                                    Esta acción no se puede deshacer.
                                </p>
                            </ModalBody>
                            <ModalFooter className="flex gap-3 mt-4 pb-8 px-8">
                                {/* Botón Cancelar - Estilo Cristal Esmerilado */}
                                <Button
                                    onPress={onClose}
                                    variant="flat"
                                    className="flex-1 h-12 rounded-2xl font-semibold text-white/70 hover:text-white transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    Cancelar
                                </Button>

                                {/* Botón Actualizar - Estilo Oro Líquido con Relieve */}
                                <Button
                                    onPress={() => handleUpdateBarber(onClose)}
                                    isLoading={isSubmitting}
                                    isDisabled={!newName || !newRole || !newImage}
                                    className="flex-[1.5] h-12 rounded-2xl font-bold text-black transition-all duration-300"
                                    style={(!newName || !newRole || !newImage)
                                        ? {
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }
                                        : {
                                            background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                            boxShadow: `
                    0 10px 20px rgba(208, 158, 30, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                `,
                                            border: 'none'
                                        }
                                    }
                                >
                                    Actualizar Barbero
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    );
}
