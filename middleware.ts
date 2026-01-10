import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('__session')?.value;

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // In a real application, you would verify the session token here
        // using firebase-admin, but since middleware runs on the Edge,
        // we usually verify custom claims or just check for existence
        // and let the Server Actions/Route Handlers do the heavy lifting of role verification.

        // For this demonstration, we'll assume the session presence is enough for the middleware
        // and the backend proxy will strictly enforce the "admin" role.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
