
import React, { Suspense } from 'react';
import { getBarbers } from '../actions';
import BarbersClient from './components/BarbersClient';
import BarbersSkeleton from './components/BarbersSkeleton';

async function BarbersData() {
    const barbers = await getBarbers();
    return <BarbersClient initialBarbers={barbers} />;
}

export default function BarbersPage() {
    return (
        <Suspense fallback={<BarbersSkeleton />}>
            <BarbersData />
        </Suspense>
    );
}
