import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';
import { redirect } from 'next/navigation';

export async function getServerSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('__session')?.value;

    if (!session) return null;

    try {
        const decodedToken = await adminAuth.verifyIdToken(session);
        return decodedToken;
    } catch (error) {
        console.error('Session verification error:', error);
        return null;
    }
}

export async function requireAdmin() {
    const session = await getServerSession();

    if (!session) {
        redirect('/');
    }

    if (session.role !== 'admin') {
        // Option: Redirect to a non-admin dashboard or error page
        // For now, redirect to /dashboard if they are just users
        redirect('/dashboard');
    }

    return session;
}
