# Configuración de Variables de Entorno para Firebase

## 🔐 Secretos Removidos

Este proyecto anteriormente contenía el archivo `lib/serviceAccountKey.json` con credenciales de Firebase. **Este archivo ha sido removido del historial de Git por razones de seguridad.**

## ⚙️ Configuración Requerida

Para ejecutar este proyecto, necesitas configurar las siguientes variables de entorno:

### Opción 1: Usar archivo `.env.local` (Desarrollo Local)

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-Clave-Privada-Aqui\n-----END PRIVATE KEY-----\n"
```

### Opción 2: Usar `serviceAccountKey.json` (Solo Desarrollo Local)

Si prefieres usar el archivo JSON:

1. Descarga tu Service Account Key desde [Firebase Console](https://console.firebase.google.com/)
2. Guárdalo como `lib/serviceAccountKey.json`
3. **NUNCA** lo commitees a Git (ya está en `.gitignore`)

### Para Producción (Vercel, etc.)

Configura las variables de entorno en tu plataforma de deployment:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`  
- `FIREBASE_PRIVATE_KEY`

## 📝 Notas Importantes

- El archivo `.env.local` está ignorado por Git y **nunca** debe ser commiteado
- El archivo `lib/serviceAccountKey.json` está ignorado por Git y **nunca** debe ser commiteado
- Para obtener estas credenciales, ve a Firebase Console → Project Settings → Service Accounts → Generate New Private Key

## 🔄 Cómo Funciona

El código en `lib/firebaseAdmin.ts` automáticamente:
1. Primero intenta usar `lib/serviceAccountKey.json` si existe
2. Si no existe, usa las variables de entorno
3. Esto permite flexibilidad en desarrollo y producción
