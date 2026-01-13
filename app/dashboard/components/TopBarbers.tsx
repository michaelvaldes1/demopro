import { getBarbers } from '@/app/admin/actions';
import TopBarbersClient from './TopBarbersClient';

export default async function TopBarbers() {
    const barbersData = await getBarbers();

    // Transform data to match the expected format
    const barbers = barbersData.map(b => ({
        ...b,
        image: b.imageUrl,
        description: b.role,
        coverImage: '/hero_bg.png', // Default cover
        socials: b.socials || {
            whatsapp: '',
            tiktok: '',
            instagram: ''
        }
    }));

    return <TopBarbersClient barbers={barbers} />;
}
