# Firebase Deployment Guide

## Prerequisites

1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Firestore Setup

Before deploying, you need to set up Firestore in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rowing-leaderboard-app`
3. Navigate to "Firestore Database"
4. Click "Create database"
5. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
6. Select a location close to your users

### Security Rules (Production)

For production, update Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users for now
    // In production, you might want to add authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Deployment

### Quick Deploy
```bash
npm run deploy
```

### Deploy Only Hosting
```bash
npm run deploy:hosting
```

### Manual Steps
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

## Project Structure

- `firebase.json` - Firebase configuration
- `.firebaserc` - Firebase project configuration
- `src/lib/firebase.js` - Firebase initialization
- `src/services/database.js` - Firestore database service

## Environment Variables

The Firebase configuration is currently hardcoded in `src/lib/firebase.js`. For production, consider using environment variables:

1. Create `.env` file (add to .gitignore)
2. Add Firebase config as environment variables
3. Update `firebase.js` to use `import.meta.env.VITE_*` variables

## Features

- **Real-time Data**: Firestore provides real-time updates across all connected clients
- **Offline Support**: Firebase automatically handles offline caching and synchronization
- **Scalability**: Firestore scales automatically with your user base
- **Hosting**: Firebase Hosting provides fast, secure hosting with global CDN

## URL

Your app will be available at:
`https://rowing-leaderboard-app.web.app`

## Next Steps

1. Set up Firestore security rules
2. Configure authentication (optional)
3. Set up environment variables for production
4. Configure custom domain (optional)
