'use client';

import React from 'react';
import AuditLogs from './AuditLogs';

interface SettingsClientProps {
    initialLogs: any[];
}

export default function SettingsClient({ initialLogs }: SettingsClientProps) {
    return (
        <div className="pb-10 px-4 md:px-8 pt-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100">Configuración</h1>
                <p className="text-zinc-500">Registro de actividad del sistema.</p>
            </div>

            <AuditLogs initialLogs={initialLogs} />
        </div>
    );
}
