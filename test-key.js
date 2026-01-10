const crypto = require('crypto');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/FIREBASE_PRIVATE_KEY="([^"]+)"/);
if (!match) {
    console.error('Key not found in .env.local');
    process.exit(1);
}

const key = match[1].replace(/\\n/g, '\n');

try {
    const sign = crypto.createSign('SHA256');
    sign.update('test');
    sign.sign(key);
    console.log('Key is valid for signing');
} catch (error) {
    console.error('Key validation failed:', error.message);
    console.log('Key start:', key.substring(0, 50));
}
