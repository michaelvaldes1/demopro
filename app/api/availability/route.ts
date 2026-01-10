import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const barberId = searchParams.get('barberId');

    if (!date || !barberId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const snapshot = await adminDb.collection('appointments')
            .where('date', '==', date)
            .where('barberId', '==', barberId)
            .get();

        const unavailableSlots = snapshot.docs
            .map(doc => doc.data())
            // Filter out cancelled or no-show, keep confirmed, blocked, completed
            .filter(data => ['confirmed', 'blocked', 'completed'].includes(data.status))
            .map(data => data.time);

        return NextResponse.json(unavailableSlots);
    } catch (error: any) {
        console.error('Error fetching availability:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
