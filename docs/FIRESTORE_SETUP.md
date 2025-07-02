# Quick Firebase Setup

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rowing-leaderboard-app`
3. In the left sidebar, click on "Firestore Database"
4. Click "Create database"
5. **Choose "Start in test mode"** (this allows read/write access for 30 days)
6. Select a location (choose the one closest to your users, e.g., `us-central` for US)
7. Click "Done"

## Step 2: Deploy Firestore Rules and Indexes

Deploy the Firestore configuration (rules and indexes):

```bash
firebase deploy --only firestore
```

This will:
- Set up the security rules
- Create the required composite indexes for efficient queries

## Step 3: Test the Application

After creating the Firestore database and deploying the configuration:

1. Open the browser console (F12)
2. Reload the application
3. Check for any error messages in the console
4. Try logging meters and see if it works

## Alternative: Manual Index Creation

If you encounter index errors, you can create indexes manually:

1. When you see an index error in the console, it will include a link
2. Click the link to create the index automatically
3. Wait for the index to build (usually takes a few minutes)

## Step 4: Set Up Authentication (Recommended Next Step)

For production use, you should add Firebase Authentication to secure your app:

### Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rowing-leaderboard-app`
3. Click "Authentication" in the left sidebar
4. Click "Get started"
5. Go to "Sign-in method" tab
6. Enable your preferred sign-in methods:
   - **Email/Password** (recommended for team use)
   - **Google** (easiest for users)
   - **Anonymous** (for guest access)

### Install Firebase Auth

```bash
npm install firebase/auth
```

### Update Security Rules

Once authentication is set up, update `firestore.rules` for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all users and sessions
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Benefits of Adding Authentication

- **Security**: Only authenticated users can access the app
- **User Management**: Automatic user profiles tied to Firebase accounts
- **Data Protection**: Users can only edit their own data
- **Team Control**: Admin can manage who has access

## Step 5: Set Production Rules (Current - No Auth)

For now, if you want to keep it simple without authentication, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true; // Or add authentication
    }
    match /sessions/{sessionId} {
      allow read, write: if true; // Or add authentication
    }
  }
}
```

## Troubleshooting

If you see "permission denied" errors:
- Make sure you selected "Start in test mode" when creating the database
- Check that the Firestore rules allow read/write access

If you see "The query requires an index" errors:
- Run `firebase deploy --only firestore` to deploy the indexes
- Or click the provided link in the error to create the index manually

If you see "failed to log meters":
- Check the browser console for detailed error messages
- Make sure Firestore database is created and accessible
- Verify the Firebase configuration in `src/lib/firebase.js`
