export const BARBERS = [
    {
        id: 'pedro',
        name: 'Pedro',
        description: 'Especialista en cortes clásicos',
        image: '/barbers/pedro.png',
        coverImage: '/hero_bg.png',
        socials: {
            whatsapp: 'https://wa.me/123456789',
            tiktok: 'https://tiktok.com/@pedro',
            instagram: 'https://instagram.com/pedro'
        }
    },
    {
        id: 'juan',
        name: 'Juan',
        description: 'Experto en estilos modernos',
        image: '/barbers/juan.png',
        coverImage: '/hero_bg.png',
        socials: {
            whatsapp: 'https://wa.me/123456789',
            tiktok: 'https://tiktok.com/@juan',
            instagram: 'https://instagram.com/juan'
        }
    },
    {
        id: 'luis',
        name: 'Luis',
        description: 'Maestro barbero tradicional',
        image: '/barbers/luis.png',
        coverImage: '/hero_bg.png',
        socials: {
            whatsapp: 'https://wa.me/123456789',
            tiktok: 'https://tiktok.com/@luis',
            instagram: 'https://instagram.com/luis'
        }
    }
] as const;

export const getBarberNames = () => BARBERS.map(barber => barber.name);

export const getBarberNamesFormatted = () => {
    const names = getBarberNames();
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} o ${names[1]}`;

    const lastBarber = names[names.length - 1];
    const otherBarbers = names.slice(0, -1).join(', ');
    return `${otherBarbers} o ${lastBarber}`;
};
