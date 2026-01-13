import React, { Suspense } from 'react';
import Hero from './Hero';
import Services from './Services';
import TopBarbers from './TopBarbers';
import FloatingActionButton from './FloatingActionButton';
import ServicesSkeleton, { BarbersSkeleton } from './DashboardSkeletons';

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Full width Hero */}
            <div className="px-6 md:px-10 max-w-[1600px] mx-auto w-full">
                <Hero />
            </div>

            {/* Contained Content */}
            <div className="max-w-7xl mx-auto px-6 w-full">
                <Suspense fallback={<ServicesSkeleton />}>
                    <Services />
                </Suspense>

                <Suspense fallback={<BarbersSkeleton />}>
                    <TopBarbers />
                </Suspense>
            </div>

            <FloatingActionButton />
        </div>
    );
}