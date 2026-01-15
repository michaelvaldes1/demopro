'use client';

import React, { useState } from 'react';
import { FileText, Trash2, Edit, CheckCircle, Lock, User, Scissors, Calendar, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AuditLog {
    id: string;
    adminEmail: string;
    action: 'create' | 'update' | 'delete' | 'status_change' | 'block';
    resourceType: 'appointment' | 'service' | 'barber' | 'user';
    resourceId: string;
    resourceName: string;
    metadata: any;
    timestamp: string;
}

interface AuditLogsProps {
    initialLogs: any[];
}

const actionConfig = {
    create: { label: 'Creó', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', icon: CheckCircle },
    update: { label: 'Actualizó', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', icon: Edit },
    delete: { label: 'Eliminó', color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20', icon: Trash2 },
    status_change: { label: 'Estado', color: 'text-[#E5B454]', bgColor: 'bg-[#E5B454]/10', borderColor: 'border-[#E5B454]/20', icon: Activity },
    block: { label: 'Bloqueó', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20', icon: Lock }
};

const resourceConfig = {
    appointment: { label: 'Cita', icon: Calendar },
    service: { label: 'Servicio', icon: Scissors },
    barber: { label: 'Barbero', icon: User },
    user: { label: 'Usuario', icon: User }
};

export default function AuditLogs({ initialLogs }: AuditLogsProps) {
    const [logs] = useState<AuditLog[]>(initialLogs as AuditLog[]);
    const [filter, setFilter] = useState<string>('all');

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.resourceType === filter);

    const getActionDescription = (log: AuditLog) => {
        const action = actionConfig[log.action];
        const resource = resourceConfig[log.resourceType];

        let description = `${action.label} ${resource.label.toLowerCase()}: ${log.resourceName}`;

        if (log.action === 'status_change' && log.metadata?.oldStatus && log.metadata?.newStatus) {
            description += ` (${log.metadata.oldStatus} → ${log.metadata.newStatus})`;
        }

        return description;
    };

    return (
        <div
            className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col h-full"
            style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(40px)',
            }}
        >
            {/* Brillo de refracción superior */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

            {/* Header */}
            <div className="flex flex-col gap-6 p-8 border-b border-white/5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                            <FileText size={24} className="text-[#E5B454]" />
                            REGISTRO
                        </h3>
                        <p className="text-white/40 text-sm mt-1 font-medium tracking-wide uppercase pl-1">
                            Auditoría de acciones administrativas
                        </p>
                    </div>
                </div>

                {/* Filter Capsule */}
                <div className="overflow-x-auto hide-scrollbar">
                    <div className="flex p-1.5 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md w-fit">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === 'all'
                                    ? 'bg-gradient-to-br from-[#E5B454] to-[#D09E1E] text-black shadow-lg scale-105'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Todos
                        </button>
                        {Object.entries(resourceConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 duration-300 ${filter === key
                                        ? 'bg-gradient-to-br from-[#E5B454] to-[#D09E1E] text-black shadow-lg scale-105 ml-2'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <config.icon size={12} />
                                {config.label}s
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar max-h-[600px]">
                {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-4">
                        <div className="p-4 rounded-full bg-white/5 border border-white/5">
                            <FileText size={40} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">Sin registros recientes</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredLogs.map((log) => {
                            const action = actionConfig[log.action];
                            const resource = resourceConfig[log.resourceType];
                            const ActionIcon = action.icon;

                            return (
                                <div
                                    key={log.id}
                                    className="group relative flex gap-4 p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {/* Icon Box */}
                                    <div className={`w-12 h-12 rounded-2xl ${action.bgColor} border ${action.borderColor} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                                        <ActionIcon size={20} className={action.color} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                                            <p className="text-sm text-white font-bold leading-tight">
                                                {getActionDescription(log)}
                                            </p>
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider whitespace-nowrap bg-white/5 px-2 py-1 rounded-lg">
                                                {formatDistanceToNow(new Date(log.timestamp), {
                                                    addSuffix: true,
                                                    locale: es
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                <User size={10} className="text-white/60" />
                                            </div>
                                            <span className="text-xs text-white/50 font-medium">{log.adminEmail}</span>
                                        </div>

                                        {/* Metadata Sunken Box */}
                                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                                                {log.metadata.date && log.metadata.time && (
                                                    <span className="px-3 py-1 bg-black/30 rounded-lg text-[10px] text-white/60 font-mono border border-white/5">
                                                        📅 {log.metadata.date.split('-').reverse().join('-')} • {log.metadata.time}
                                                    </span>
                                                )}
                                                {log.metadata.price && (
                                                    <span className="px-3 py-1 bg-black/30 rounded-lg text-[10px] text-[#E5B454] font-mono font-bold border border-white/5">
                                                        ${log.metadata.price}
                                                    </span>
                                                )}
                                                {log.metadata.category && (
                                                    <span className="px-3 py-1 bg-black/30 rounded-lg text-[10px] text-white/60 font-mono border border-white/5">
                                                        {log.metadata.category}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}