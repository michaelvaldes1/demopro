import React from 'react';
import { getAuditLogs } from '../actions';
import SettingsClient from '@/app/admin/settings/SettingsClient';

export default async function SettingsPage() {
    const auditLogs = await getAuditLogs(100);

    return <SettingsClient initialLogs={auditLogs} />;
}
