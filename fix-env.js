const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
let content = fs.readFileSync(envPath, 'utf8');

// Remove existing FIREBASE_ entries (only the server ones)
content = content.split('\n').filter(line =>
    !line.startsWith('FIREBASE_PROJECT_ID') &&
    !line.startsWith('FIREBASE_CLIENT_EMAIL') &&
    !line.startsWith('FIREBASE_PRIVATE_KEY')
).join('\n');

const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxWtDTuSdAAGzf\nOvwkRpCKYaHnKNwt8ZlT/KWK2upjSWZsSDAljuv4cjnR/tfEeVGj5cqQ4sgO+Nh9\nxVYERu/wQTsKy3SZCnsONFxcF3nTuWkFWHbqMzUV+/B8YM0rbIY8O3Zf31ENmAi3\newkbCvkNqZub5mYyeD42bt1mV74vBohpHk2N5AXxJBMHzQfG6ZnMnJRA1a/796vg\nQ9mCjmSJpuLaskpoCvW3WHY5Eljg16hJf59d68qssBWDEI9SRb+z7P+HzBRmoX9W\nzyHidK0ULJsvc4AKOdPYy9swHxw7piP3MUlZitE/5oAuH1LQJSs58iaiMUbyv7Ny\nHByS41mLAgMBAAECggEAB5COE68euMt2hAGqEN9e+ZK3KyWXrptSz5LuegENukpp\nL06CRI0st3N3z+Mveivf4D5u6MXOLq/32/V3eRs6z2PuNsRS0YGcRLuAV6qQrF0z\ng4zbFZuK33Mti2s9lQ/onIJqHCYUTkt2eQ0AaGzhY+8gugJBHan5+AG748pI9wxy\nv2A105+EQReIiazZcRfSnJHxW56w3uBSLsidN9BIuTIvB0OKDkHx9ZgWEN1vonU0\n3AL4F+0wf+m6JsCtCTQuXsh0trHfboRMrEQ9zBUoH2tR06yQOlHzGD8p9dEgGADB\nPaWTypI3mWn/BvdM/nYC00iyt4BVgp56Oozoe9lfsQKBgQDhGIbMURM9ON4YEuek\nrQGhjkm+zxxPLaNcEYjhCgylBchq7hT1TyG5snHK1xvxA2naqWu91pVyoHpBlnLZ\nO2N6+Rkc4kpz6dY0p1u4HUIGVuMbEeRkLIVk4hosgwMAqBxzBGbyaYlANGLwKA3t\ne2bh5JNrkf08Te9g5CqjOcDOjQKBgQDJtFPea+MsLq1ButQg7Hz4BjmgADhTaeiD\n6Fx1aMzq6UIG9rKUnLoUrnG4i1d/Qib7XYtasz1lEsiI94ewqqVA2yv4tCqsmgCq\njLA3nXyCDd5bwiAPc8J3664+jVLCZR67iPg+Is1pJjtLjhEIfVA1zLamCts8vjah\n8+vyCz4udwKBgQCqgJOKrFbwZuUEQz2npUy4/TirCeKdryowkS+nlp8hWRIIvTKu\n5jPbn2lGhk4p77X85Zww/hvR6fDxQW7ZUXz3Jzx4foh66MNSuvpkqfTbLHF2jcT8\nhCS+1+2PjeV2V+DE1q7MLFjEg2n2E8EJBBJYRXXNY5X4Weha8jnBzftX+QKBgGgm\nZOgEbVjzASNfhQk7E4w+KqMjefIYTadO4+78HlNt/ln6KFv0UWE8chwIVzWuwtIo\nizxaMOlvuXx/0+C1PH8wrJPO8/oLyyxFWPheqVu+LYLTyhowe8nQODi0YHdgH25W\nW1g6QDZ7N0LcKI9ppXEiM22pTWsgDLWzbbGdfI4hAoGBAJCp+hP5zGGBvOQxD9+h\nS1T+uzoXmR/rirG3pGesyZ6GqyvTQdHlNPfRp853DOmtE54XDWtin9xjO4pimH38\nH47B2jCweHee7vEoLTnI8cfp09mro7e5lsk5HC8GRwRZf/l1mCPykDVZzDud8n+u\nANHsV5wy8aqHYbroOlZMEJAH\n-----END PRIVATE KEY-----\n`;

const newEntries = `
FIREBASE_PROJECT_ID="tatoobarberproo"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@tatoobarberproo.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"
`;

fs.writeFileSync(envPath, content.trim() + '\n' + newEntries.trim() + '\n');
console.log('Updated .env.local successfully');
