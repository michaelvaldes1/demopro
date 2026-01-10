import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function GET() {
    const adminEmail = 'mvaldes06119@gmail.com';

    try {
        // Buscar al usuario por correo
        const user = await adminAuth.getUserByEmail(adminEmail);

        // Asignar el rol de administrador
        await adminAuth.setCustomUserClaims(user.uid, { role: 'admin' });

        return NextResponse.json({
            success: true,
            message: `Usuario ${adminEmail} ahora es Administrador. UID: ${user.uid}. Por favor, cierra sesión y vuelve a entrar para actualizar la sesión.`
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            code: error.code
        }, { status: 500 });
    }
}
