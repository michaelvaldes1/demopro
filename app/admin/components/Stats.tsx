import React from 'react';
import { Stat } from '../types';

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
    <div className="flex-1 bg-card-dark border border-slate-800/50 p-4 rounded-2xl">
        <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
        </div>
        <div className="space-y-1">
            <h3 className="text-xl font-bold">{stat.value}</h3>
            {/* Change indicator is hardcoded for now or can be calculated if we compare with prev day */}
            <p className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                {stat.change}
            </p>
        </div>
    </div>
);

interface StatsProps {
    data: {
        revenue: number;
        bookings: number;
        clients: number;
    }
}

const Stats: React.FC<StatsProps> = ({ data }) => {
    // Format currency
    const formattedRevenue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(data.revenue);

    const stats: Stat[] = [
        { label: 'Ingresos', value: formattedRevenue, change: '+0%', icon: 'payments' },
        { label: 'Citas', value: data.bookings.toString(), change: '+0%', icon: 'calendar_today' },
        { label: 'Clientes', value: data.clients.toString(), change: '+0%', icon: 'person' },
    ];

    return (
        <div className="px-6 flex gap-4">
            {stats.map((stat, idx) => (
                <StatCard key={idx} stat={stat} />
            ))}
        </div>
    );
};

export default Stats;
