# Environment Variables

## Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your Firebase project values** in `.env`:
   ```bash
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   # ... etc
   ```

## Firebase Configuration

All Firebase configuration is now stored in environment variables with the `VITE_` prefix (required for Vite to expose them to the browser):

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID (for Analytics)

## Where to Find These Values

1. **Firebase Console** → Your Project → ⚙️ Settings → General
2. **Your apps** section → Firebase SDK snippet → Config
3. Copy the values from the `firebaseConfig` object

## Important Notes

- ⚠️ **`.env` is in `.gitignore`** - Your API keys won't be committed to git
- ⚠️ **Use `.env.example` as reference** - Share this with your team instead of `.env`
- ⚠️ **`VITE_` prefix is required** - Vite only exposes environment variables that start with `VITE_`
- ⚠️ **Client-side exposure** - These variables will be visible in the browser (this is normal for Firebase)

## Production Deployment

For production deployment (Firebase Hosting), you may need to set these environment variables in your CI/CD system or hosting platform if you're not using local builds.

## Security

Firebase API keys are safe to expose in client-side code because:
- They identify your project, not authenticate access
- Security is handled by Firebase Security Rules
- Domain restrictions can be set in Firebase Console
