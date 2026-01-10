const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./lib/serviceAccountKey.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log('App initialized');

    admin.auth().listUsers(1)
        .then(() => console.log('Successfully connected to Firebase Auth'))
        .catch(err => console.error('Failed to connect:', err.message));
} catch (err) {
    console.error('Initialization failed:', err.message);
}
