import { getServices } from '../actions';
import ServicesClient from './ServicesClient';

export default async function ServicesPage() {
    // Fetch de datos directamente en el servidor
    const initialServices = await getServices();

    return <ServicesClient initialServices={initialServices} />;
}