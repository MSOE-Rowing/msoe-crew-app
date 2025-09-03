## Environment

Minimal reference for required Firebase config.

### 1. Create `.env`
```bash
cp .env.example .env
```

### 2. Fill Values
Required (all must start with `VITE_`):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# Optional
VITE_FIREBASE_MEASUREMENT_ID=
```

### 3. Where to Find Them
Firebase Console → Project Settings (gear) → General → Your apps → Config object.

### Notes
- `.env` is git‑ignored; share only `.env.example`.
- `VITE_` prefix required for exposure to the client.
- Keys are public identifiers; security relies on Firestore rules.

Done. Restart dev server if already running.
