import React, { Suspense } from 'react';
import { getBarbers } from './actions';
import { format } from 'date-fns';
import DashboardClient from './components/DashboardClient';
import StatsContainer from './components/StatsContainer';
import TimelineContainer from './components/TimelineContainer';
import { StatSkeleton, TimelineSkeleton } from './components/DashboardSkeleton';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
    const params = await searchParams;
    const selectedDate = typeof params.date === 'string' ? params.date : format(new Date(), 'yyyy-MM-dd');
    const selectedBarberId = typeof params.barber === 'string' ? params.barber : 'all';

    const barbers = await getBarbers();

    return (
        <DashboardClient
            selectedDate={selectedDate}
            barbers={barbers}
            statsSection={
                <Suspense
                    key={`stats-init-${selectedBarberId}`}
                    fallback={
                        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 py-6">
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </div>
                    }
                >
                    <StatsContainer date={selectedDate} barberId={selectedBarberId} />
                </Suspense>
            }
            timelineSection={
                <Suspense
                    key={`timeline-init-${selectedBarberId}`}
                    fallback={<TimelineSkeleton />}
                >
                    <TimelineContainer date={selectedDate} barberId={selectedBarberId} />
                </Suspense>
            }
        />
    );
}