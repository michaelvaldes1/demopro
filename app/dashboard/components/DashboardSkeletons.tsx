import React from 'react';

export default function ServicesSkeleton() {
    return (
        <div className="mt-12">
            <div className="h-9 w-64 bg-zinc-800 animate-pulse rounded-lg mb-8" />
            <div className="flex overflow-x-auto pb-6 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-64 h-80 bg-zinc-900 rounded-3xl" />
                ))}
            </div>
        </div>
    );
}

export function BarbersSkeleton() {
    return (
        <div className="mt-12 pb-12">
            <div className="h-9 w-48 bg-zinc-800 animate-pulse rounded-lg mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-96 bg-zinc-900 rounded-3xl" />
                ))}
            </div>
        </div>
    );
}
