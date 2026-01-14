import { Suspense } from 'react';
import ServicesClient from './ServicesClient';
import ServicesList from './ServicesList';
import ServicesSkeleton from './ServicesSkeleton';

export default async function ServicesPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    // La clave depende de los parámetros de búsqueda para forzar el skeleton al filtrar
    const searchKey = JSON.stringify(await searchParams);

    return (
        <ServicesClient>
            <Suspense key={searchKey} fallback={<ServicesSkeleton />}>
                <ServicesList searchParams={searchParams} />
            </Suspense>
        </ServicesClient>
    );
}