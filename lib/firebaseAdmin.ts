import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

function getFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.apps[0];
    }

    try {
        const serviceAccountPath = path.join(process.cwd(), 'lib', 'serviceAccountKey.json');

        if (fs.existsSync(serviceAccountPath)) {
            console.log('Using serviceAccountKey.json from:', serviceAccountPath);
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            return admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }

        console.log('serviceAccountKey.json not found, falling back to environment variables');

        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY is missing');
        }

        // Clean and format private key
        privateKey = privateKey.trim();
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.substring(1, privateKey.length - 1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
    } catch (error: any) {
        console.error('Firebase Admin initialization error:', error.message);
        throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
    }
}

// Initialize the app once
const app = getFirebaseAdmin();

export const adminDb = admin.firestore(app!);
export const adminAuth = admin.auth(app!);
