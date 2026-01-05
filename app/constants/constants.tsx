import { ServiceItem } from './types';

export const SERVICES: ServiceItem[] = [
    {
        id: 'h1',
        category: 'Corte de Cabello',
        name: 'The Urban Fade',
        description: 'Degradado de precisión con delineado a navaja y peinado con textura.',
        price: 35,
        duration: '45 min',
    },
    {
        id: 'h2',
        category: 'Corte de Cabello',
        name: 'Corte Clásico a Tijera',
        description: 'Corte tradicional adaptado a la forma de tu cabeza, acabado con toalla caliente.',
        price: 40,
        duration: '60 min',
    },
    {
        id: 'b1',
        category: 'Arreglo de Barba',
        name: 'Esculpido de Barba',
        description: 'Perfilado profesional completo con tratamiento de aceite premium.',
        price: 25,
        duration: '30 min',
    },
    {
        id: 'b2',
        category: 'Arreglo de Barba',
        name: 'Afeitado con Toalla Caliente',
        description: 'Afeitado tradicional a navaja con vaporizador facial y bálsamo.',
        price: 30,
        duration: '40 min',
    },
    {
        id: 'f1',
        category: 'Facial',
        name: 'Limpieza con Mascarilla Negra',
        description: 'Limpieza profunda de poros para rejuvenecer tu piel.',
        price: 20,
        duration: '20 min',
    },
    {
        id: 'f2',
        category: 'Facial',
        name: 'Rejuvenecimiento Gold',
        description: 'Mascarilla de lujo con infusión de oro de 24k para una luminosidad máxima.',
        price: 45,
        duration: '35 min',
    }
];

export const CATEGORIES: { label: string; value: string }[] = [
    { label: 'Todos', value: 'All' },
    { label: 'Cortes', value: 'Corte de Cabello' },
    { label: 'Barba', value: 'Arreglo de Barba' },
    { label: 'Facial', value: 'Facial' },
];
