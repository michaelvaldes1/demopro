import React from 'react';

export const ServiceCardSkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-pulse">
        <div className="flex-1 space-y-3">
            <div className="h-5 w-48 bg-white/10 rounded-lg"></div>
            <div className="h-3 w-64 bg-white/5 rounded-lg"></div>
            <div className="flex items-center gap-4 mt-2">
                <div className="h-4 w-16 bg-white/10 rounded-lg"></div>
                <div className="h-4 w-16 bg-white/10 rounded-lg"></div>
                <div className="h-5 w-24 bg-white/5 rounded-lg"></div>
            </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/10"></div>
    </div>
);

export default function ServicesSkeleton() {
    return (
        <div className="grid gap-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </div>
    );
}
