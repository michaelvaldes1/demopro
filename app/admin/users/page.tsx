'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Avatar, Chip, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Pagination, Spinner } from "@heroui/react";
import { Search, Filter, MoreVertical, Shield, ShieldAlert } from 'lucide-react';
import { getAdminUsers } from '../actions';

const columns = [
    { name: "USUARIO", uid: "user", sortable: true },
    { name: "ROL", uid: "role", sortable: true },
    { name: "VISITAS", uid: "visits", sortable: true },
    { name: "ÚLTIMA VISITA", uid: "lastVisit", sortable: true },
    { name: "ESTADO", uid: "status", sortable: true },
    { name: "ACCIONES", uid: "actions" },
];

const statusColorMap: Record<string, "success" | "warning" | "danger" | "primary" | "secondary" | "default"> = {
    active: "success",
    frequent: "primary",
    inactive: "danger",
    new: "secondary",
};

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

    const rowsPerPage = 10;

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getAdminUsers();
                console.log('Users loaded in component:', data.map(u => ({ name: u.name, avatar: u.avatar })));
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        };
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
            filteredUsers = filteredUsers.filter((user) => user.statusType === statusFilter);
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof typeof user];

        switch (columnKey) {
            case "user":
                return (
                    <div className="flex items-center gap-3">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover border-2 border-zinc-700"
                                onError={(e) => {
                                    console.error('Image failed to load:', user.avatar);
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`w-10 h-10 min-w-10 min-h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40 ${user.avatar ? 'hidden' : ''}`}>
                            <span className="text-primary font-bold text-sm">{user.name?.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-zinc-100 font-bold text-sm leading-tight">{user.name}</span>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-wide leading-tight">{user.email}</span>
                        </div>
                    </div>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className={`text-bold text-xs capitalize ${user.role === 'admin' ? 'text-primary' : 'text-zinc-400'}`}>
                            {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </p>
                    </div>
                );
            case "visits":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm text-zinc-300 capitalize">{user.visitCount}</p>
                    </div>
                );
            case "lastVisit":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm text-zinc-400 capitalize text-[10px]">{user.lastVisit}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[user.statusType as keyof typeof statusColorMap] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {user.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-zinc-900 border border-zinc-800">
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <MoreVertical className="text-zinc-400" size={20} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Acciones de usuario">
                                <DropdownItem key="view" startContent={<Search size={14} />}>Ver Perfil</DropdownItem>
                                {user.role !== 'admin' ? (
                                    <DropdownItem key="make_admin" startContent={<Shield size={14} />} className="text-warning">Hacer Admin</DropdownItem>
                                ) : null}
                                <DropdownItem key="block" startContent={<ShieldAlert size={14} />} className="text-danger" color="danger">Bloquear</DropdownItem>
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
        <div className="pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Gestión de Clientes</h1>
                <p className="text-zinc-400 text-sm mt-1">Administra la base de clientes, verifica su frecuencia y estado.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 items-center">
                <Input
                    isClearable
                    className="w-full sm:max-w-[320px]"
                    placeholder="Buscar por nombre o email..."
                    startContent={<Search className="text-zinc-500" size={16} />}
                    value={filterValue}
                    onClear={() => onSearchChange("")}
                    onValueChange={onSearchChange}
                    variant="flat"
                    classNames={{
                        inputWrapper: "bg-zinc-800 data-[hover=true]:bg-zinc-700/80 group-data-[focus=true]:bg-zinc-700/80",
                        input: "text-sm text-zinc-200 placeholder:text-zinc-500",
                    }}
                />
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    {statusOptions.map((status) => (
                        <button
                            key={status.uid}
                            onClick={() => setStatusFilter(status.uid)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${statusFilter === status.uid
                                ? 'bg-primary text-black border-primary'
                                : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                        >
                            {status.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-xl">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner color="warning" />
                    </div>
                ) : (
                    <Table
                        aria-label="Tabla de usuarios"
                        isHeaderSticky
                        bottomContent={
                            pages > 0 ? (
                                <div className="flex w-full justify-center px-4 mb-4">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="warning"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                        classNames={{
                                            cursor: "bg-primary text-black font-bold",
                                            item: "bg-transparent text-zinc-500",
                                            next: "text-zinc-400",
                                            prev: "text-zinc-400",
                                        }}
                                    />
                                </div>
                            ) : null
                        }
                        classNames={{
                            wrapper: "bg-transparent shadow-none",
                            table: "min-w-full",
                            th: "bg-zinc-900/80 text-zinc-500 font-bold uppercase text-[10px] tracking-widest border-b border-zinc-800 py-3 px-4 text-left",
                            td: "border-b border-zinc-800/30 py-4 px-4 text-left group-data-[last=true]:border-none",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={items} emptyContent={<div className="text-zinc-500 py-8">No se encontraron usuarios</div>}>
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
    );
}

