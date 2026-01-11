import React from 'react';
import { DollarSign, Calendar, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface Stat {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
}

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
    <div
        className="flex-1 p-6 rounded-[2.5rem] group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02]"
        style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.2),
                inset 0 1px 1px rgba(255, 255, 255, 0.3),
                inset 0 0 20px rgba(255, 255, 255, 0.02)
            `,
        }}
    >
        <div className="flex justify-between items-start mb-6">
            {/* Icono con el estilo "Liquid Gold" de los botones */}
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-lg transition-transform duration-500 group-hover:rotate-[10deg]"
                style={{
                    background: 'linear-gradient(135deg, #E5B454 0%, #D09E1E 100%)',
                    boxShadow: '0 8px 20px rgba(208, 158, 30, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                }}
            >
                {React.cloneElement(stat.icon as React.ReactElement, { size: 22 } as any)}
            </div>

            {/* Badge de tendencia estilo Glass Pill */}
            <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black border transition-all duration-300 ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    stat.trend === 'down' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-white/5 text-white/40 border-white/10'
                    }`}
                style={{ backdropFilter: 'blur(10px)' }}
            >
                {stat.trend === 'up' && <TrendingUp size={14} />}
                {stat.trend === 'down' && <TrendingDown size={14} />}
                {stat.change}
            </div>
        </div>

        <div className="space-y-1">
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
                {stat.label}
            </p>
            <h3 className="text-3xl font-black text-white tracking-tight">
                {stat.value}
            </h3>
        </div>

        {/* Reflejo decorativo inferior */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
);

interface StatsProps {
    data: {
        revenue: number;
        bookings: number;
        clients: number;
        revenueChange?: string;
        bookingsChange?: string;
        clientsChange?: string;
        revenueTrend?: 'up' | 'down' | 'neutral';
        bookingsTrend?: 'up' | 'down' | 'neutral';
        clientsTrend?: 'up' | 'down' | 'neutral';
    }
}

const Stats: React.FC<StatsProps> = ({ data }) => {
    const formattedRevenue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(data.revenue);

    const stats: Stat[] = [
        {
            label: 'Ingresos',
            value: formattedRevenue,
            change: data.revenueChange || '+0%',
            trend: data.revenueTrend || 'neutral',
            icon: <DollarSign />
        },
        {
            label: 'Citas',
            value: data.bookings.toString(),
            change: data.bookingsChange || '+0%',
            trend: data.bookingsTrend || 'neutral',
            icon: <Calendar />
        },
        {
            label: 'Clientes',
            value: data.clients.toString(),
            change: data.clientsChange || '+0%',
            trend: data.clientsTrend || 'neutral',
            icon: <Users />
        },
    ];

    return (
        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 py-6">
            {stats.map((stat, idx) => (
                <StatCard key={idx} stat={stat} />
            ))}
        </div>
    );
};

export default Stats;