import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const key = rawKey.replace(/\\n/g, '\n');
    const config = {
        PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
        RAW_KEY_START: rawKey.substring(0, 50).replace(/\n/g, '[NL]'),
        PROCESSED_KEY_START: key.substring(0, 50).replace(/\n/g, '[NL]'),
        HAS_HEADER: key.includes('-----BEGIN PRIVATE KEY-----'),
        HAS_FOOTER: key.includes('-----END PRIVATE KEY-----'),
        KEY_LENGTH: key.length,
    };

    return NextResponse.json(config);
}
