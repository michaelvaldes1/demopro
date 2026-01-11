'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Search, MoreVertical, Shield, ShieldAlert, RefreshCw, User } from 'lucide-react';
import { getAdminUsers, setUserAsAdmin, removeAdminRole } from '../actions';

const columns = [
    { name: "USUARIO", uid: "user", sortable: true },
    { name: "ROL", uid: "role", sortable: true },
    { name: "VISITAS", uid: "visits", sortable: true },
    { name: "ÚLTIMA VISITA", uid: "lastVisit", sortable: true },
    { name: "ESTADO", uid: "status", sortable: true },
    { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
    { name: "Todos", uid: "all" },
    { name: "Frecuentes", uid: "frequent" },
    { name: "Activos", uid: "active" },
    { name: "Nuevos", uid: "new" },
    { name: "Inactivos", uid: "inactive" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const rowsPerPage = 8;

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAdminUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.email.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) => {
                const daysCreation = user.daysSinceCreation ?? 999;
                const daysLastVisit = user.daysSinceLastVisit;

                switch (statusFilter) {
                    case "new": return daysCreation <= 15;
                    case "frequent": return daysLastVisit !== null && daysLastVisit <= 8;
                    case "active": return daysLastVisit !== null && daysLastVisit <= 30;
                    case "inactive": return daysLastVisit === null ? daysCreation > 15 : daysLastVisit >= 45;
                    default: return true;
                }
            });
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const handleRoleChange = async (uid: string, currentRole: string) => {
        try {
            setLoading(true);
            if (currentRole === 'admin') {
                await removeAdminRole(uid);
            } else {
                await setUserAsAdmin(uid);
            }
            const data = await getAdminUsers();
            setUsers(data);
        } catch (error: any) {
            console.error("Failed to change role", error);
            alert(error.message || "Error al cambiar el rol");
        } finally {
            setLoading(false);
        }
    };

    const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof typeof user];

        switch (columnKey) {
            case "user":
                return (
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full object-cover aspect-square border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-full aspect-square bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner ${user.avatar ? 'hidden' : ''}`}>
                                <span className="text-[#E5B454] font-black text-lg">{user.name?.charAt(0)}</span>
                            </div>

                            {user.role === 'admin' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5B454] rounded-full border-2 border-black shadow-[0_0_10px_rgba(229,180,84,0.6)] flex items-center justify-center">
                                    <Shield size={8} className="text-black" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-sm tracking-tight">{user.name}</span>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">{user.email}</span>
                        </div>
                    </div>
                );
            case "role":
                return (
                    <div className={`inline-flex px-3 py-1 rounded-lg border ${user.role === 'admin'
                        ? 'bg-[#E5B454]/10 border-[#E5B454]/30 text-[#E5B454]'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                        }`}>
                        <p className="text-[10px] font-black uppercase tracking-widest">
                            {user.role === 'admin' ? 'Admin' : 'Cliente'}
                        </p>
                    </div>
                );
            case "visits":
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <p className="text-sm font-bold text-white/70 tabular-nums">{user.visitCount}</p>
                    </div>
                );
            case "lastVisit":
                return (
                    <p className="text-xs font-medium text-white/40">{user.lastVisit}</p>
                );
            case "status":
                const getStatusStyle = (type: string) => {
                    switch (type) {
                        case 'active': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                        case 'frequent': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
                        case 'inactive': return "bg-rose-500/10 text-rose-400 border-rose-500/20";
                        case 'new': return "bg-purple-500/10 text-purple-400 border-purple-500/20";
                        default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
                    }
                };
                return (
                    <div className={`inline-flex px-3 py-1 rounded-full border backdrop-blur-md ${getStatusStyle(user.statusType)}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wide">{user.status}</span>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown
                            className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
                            classNames={{
                                content: "p-1"
                            }}
                        >
                            <DropdownTrigger>
                                <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95">
                                    <MoreVertical size={18} />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Acciones">
                                <DropdownItem key="view" startContent={<Search size={14} />} className="text-white/80 data-[hover=true]:bg-white/10 rounded-xl">Ver Perfil</DropdownItem>
                                {user.role !== 'admin' ? (
                                    <DropdownItem
                                        key="make_admin"
                                        startContent={<Shield size={14} />}
                                        className="text-[#E5B454] data-[hover=true]:bg-[#E5B454]/10 rounded-xl"
                                        onPress={() => handleRoleChange(user.id, user.role)}
                                    >
                                        Hacer Admin
                                    </DropdownItem>
                                ) : (
                                    <DropdownItem
                                        key="remove_admin"
                                        startContent={<ShieldAlert size={14} />}
                                        className="text-danger data-[hover=true]:bg-danger/10 rounded-xl"
                                        onPress={() => handleRoleChange(user.id, user.role)}
                                    >
                                        Quitar Admin
                                    </DropdownItem>
                                )}
                                <DropdownItem key="block" startContent={<ShieldAlert size={14} />} className="text-danger data-[hover=true]:bg-danger/10 rounded-xl">Bloquear</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    return (
        <div className="pb-10 px-4 md:px-8 pt-6">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                    GESTIÓN DE CLIENTES
                </h1>
                <p className="text-white/40 text-sm mt-2 font-medium tracking-wide uppercase">
                    Base de datos y permisos
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 items-end">
                <div className="flex items-center gap-3 w-full md:max-w-lg">
                    <div className="relative flex-1 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-[#E5B454] transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="BUSCAR USUARIO..."
                            className="w-full pl-12 pr-10 py-3.5 bg-black/20 border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-black/40 focus:border-[#E5B454]/30 focus:shadow-[0_0_20px_rgba(229,180,84,0.1)] transition-all uppercase tracking-wider font-bold shadow-inner"
                        />
                        {filterValue && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                <div className="bg-white/10 rounded-full p-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={loadUsers}
                        className="w-[50px] h-[50px] flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 hover:text-white text-white/50 rounded-2xl transition-all shadow-lg active:scale-95 backdrop-blur-md"
                        title="Actualizar lista"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin text-[#E5B454]" : ""} />
                    </button>
                </div>

                <div
                    className="flex p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] overflow-x-auto hide-scrollbar max-w-full"
                    style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                >
                    {statusOptions.map((status) => (
                        <button
                            key={status.uid}
                            onClick={() => setStatusFilter(status.uid)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap duration-300 ${statusFilter === status.uid
                                ? 'text-black shadow-lg scale-100'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                            style={statusFilter === status.uid ? {
                                background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                                boxShadow: '0 4px 12px rgba(208, 158, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                            } : {}}
                        >
                            {status.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenedor Principal Liquid Glass */}
            <div
                className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500"
                style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    backdropFilter: 'blur(40px)',
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

                {/* CORRECCIÓN 2: Wrapper de scroll separado del contenedor visual */}
                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-80">
                            <Spinner color="warning" size="lg" />
                        </div>
                    ) : (
                        <Table
                            aria-label="Tabla de usuarios"
                            removeWrapper
                            bottomContent={
                                pages > 0 ? (
                                    <div className="flex w-full justify-center px-4 py-6 border-t border-white/5 sticky left-0">
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="warning"
                                            page={page}
                                            total={pages}
                                            onChange={(page) => setPage(page)}
                                            classNames={{
                                                cursor: "bg-[#E5B454] text-black font-bold shadow-[0_0_15px_rgba(229,180,84,0.4)]",
                                                item: "bg-transparent text-white/30 hover:text-white",
                                                next: "text-white/30 hover:text-white",
                                                prev: "text-white/30 hover:text-white",
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            classNames={{
                                th: "bg-black/20 text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] border-b border-white/5 h-14 first:pl-8 last:pr-8",
                                td: "py-4 border-b border-white/5 first:pl-8 last:pr-8 group-data-[last=true]:border-none",
                                tr: "hover:bg-white/[0.02] transition-colors duration-200 group",
                            }}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.uid}
                                        align={column.uid === "actions" ? "end" : "start"}
                                        className={column.uid === 'user' ? 'min-w-[250px]' : 'min-w-[120px]'}
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={items} emptyContent={
                                <div className="text-white/30 py-20 text-center w-full flex flex-col items-center gap-4">
                                    <User size={48} strokeWidth={1} />
                                    <p className="text-sm font-medium">No se encontraron usuarios</p>
                                </div>
                            }>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}