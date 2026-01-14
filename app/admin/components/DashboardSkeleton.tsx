import React from 'react';

export const StatSkeleton = () => (
    <div
        className="flex-1 p-6 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl animate-pulse"
        style={{ height: '180px' }}
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10"></div>
            <div className="w-16 h-6 rounded-full bg-white/5"></div>
        </div>
        <div className="space-y-3">
            <div className="h-3 w-20 bg-white/10 rounded-full"></div>
            <div className="h-8 w-32 bg-white/10 rounded-xl"></div>
        </div>
    </div>
);

export const TimelineSkeleton = () => (
    <div className="px-4 md:px-8 mt-10 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-white/10 rounded-xl mb-10"></div>
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 opacity-40">
                <div className="w-16 flex flex-col items-center pt-3">
                    <div className="h-4 w-10 bg-white/10 rounded"></div>
                    <div className="w-[1.5px] h-24 bg-gradient-to-b from-white/10 to-transparent mt-3"></div>
                </div>
                <div className="flex-1 p-5 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md h-32">
                    <div className="flex gap-3 items-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-white/10 rounded"></div>
                            <div className="h-3 w-16 bg-white/5 rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                        <div className="h-3 w-full bg-white/5 rounded"></div>
                        <div className="h-3 w-full bg-white/5 rounded"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function DashboardSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Stats Skeleton */}
            <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 py-6">
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
            </div>

            {/* Calendar Strip Placeholder */}
            <div className="mt-6 px-4 md:px-8">
                <div className="flex gap-3 overflow-hidden pb-2 opacity-20">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="min-w-[64px] h-20 rounded-2xl bg-white/10"></div>
                    ))}
                </div>
            </div>

            {/* Timeline Skeleton */}
            <TimelineSkeleton />
        </div>
    );
}
