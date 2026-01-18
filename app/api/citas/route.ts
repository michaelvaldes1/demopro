import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';

// This Route Handler acts as a proxy for Firestore
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Security: Ensure the user can only create appointments for themselves
        // Validate that the userId and clientEmail in data match the token or user is admin
        if (decodedToken.role !== 'admin') {
            const isOwner = body.userId === decodedToken.uid && body.clientEmail === decodedToken.email;
            if (!isOwner) {
                return NextResponse.json({ error: 'Forbidden: You cannot impersonate another user' }, { status: 403 });
            }
        }

        // Proxy the write to Firestore
        const docRef = await adminDb.collection('appointments').add({
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Forward to n8n webhook
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            try {
                console.log('Sending data to n8n webhook:', n8nWebhookUrl);
                const n8nResponse = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: docRef.id,
                        ...body,
                        createdAt: new Date().toISOString()
                    })
                });

                if (n8nResponse.ok) {
                    console.log('Successfully sent to n8n');
                } else {
                    const errorText = await n8nResponse.text();
                    console.error('n8n webhook failed:', n8nResponse.status, errorText);
                }
            } catch (err) {
                console.error('Fetch exception for n8n:', err);
            }
        }

        // Optimization: Track the user in a dedicated collection for faster stats
        // Standardize: Use lowercase email as the unique document ID
        const userEmail = (body.clientEmail || decodedToken.email).toLowerCase();
        await adminDb.collection('users').doc(userEmail).set({
            email: userEmail,
            name: body.clientName || decodedToken.name || 'Cliente',
            avatar: decodedToken.picture || null, // Capture Google profile picture
            updatedAt: new Date().toISOString(),
        }, { merge: true });

        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error in Proxy POST:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        let query = adminDb.collection('appointments');

        // Security: Clients can only see their own appointments
        if (decodedToken.role !== 'admin') {
            if (!userId || userId !== decodedToken.uid) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            // @ts-ignore
            query = query.where('userId', '==', userId);
        }

        const snapshot = await query.get();
        const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(appointments);
    } catch (error: any) {
        console.error('Error in Proxy GET:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
