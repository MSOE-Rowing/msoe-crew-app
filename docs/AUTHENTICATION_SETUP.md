# Firebase Authentication Setup Guide

## Overview

Adding Firebase Authentication will:
- Secure your rowing app with proper user management
- Tie user profiles to Firebase accounts
- Ensure users can only edit their own data
- Provide admin control over team access

## Step 1: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rowing-leaderboard-app`
3. Click **"Authentication"** in the left sidebar
4. Click **"Get started"**
5. Go to **"Sign-in method"** tab
6. Enable sign-in methods:

### Recommended Sign-in Methods:

**Option A: Email/Password (Best for Team Control)**
- Enable "Email/Password"
- Admin can create accounts for team members
- Good for controlled access

**Option B: Google Sign-in (Easiest for Users)**
- Enable "Google"
- Users sign in with their Google accounts
- Fastest setup for users

**Option C: Mixed Approach**
- Enable both Email/Password and Google
- Maximum flexibility

## Step 2: Install Firebase Auth Dependencies

```bash
npm install
# Firebase auth is already included in the firebase package
```

## Step 3: Update Firebase Configuration

Update `src/lib/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // ... your existing config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

## Step 4: Create Authentication Service

Create `src/services/auth.js`:

```javascript
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Sign in with email/password
  async signInWithEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Create account with email/password
  async signUpWithEmail(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  // Sign in with Google
  async signInWithGoogle() {
    return await signInWithPopup(auth, googleProvider);
  },

  // Sign out
  async signOut() {
    return await signOut(auth);
  },

  // Listen for auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};
```

## Step 5: Update Database Service for Auth

Update `src/services/database.js` to tie user profiles to Firebase Auth:

```javascript
// Add to RowingDB class
async addUser(name, status = 'Ready to row! 🚣', authUid = null) {
  try {
    const user = {
      name,
      status,
      authUid, // Link to Firebase Auth user
      createdAt: serverTimestamp(),
      totalMeters: 0
    };

    const docRef = await addDoc(collection(this.db, this.usersCollection), user);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Get user by Firebase Auth UID
async getUserByAuthUid(authUid) {
  try {
    const q = query(
      collection(this.db, this.usersCollection),
      where('authUid', '==', authUid)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by auth UID:', error);
    throw error;
  }
}
```

## Step 6: Create Authentication Components

Create `src/components/Login.svelte`:

```svelte
<script>
  import { authService } from '../services/auth.js';
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  let email = '';
  let password = '';
  let isLoading = false;

  async function handleEmailSignIn() {
    try {
      isLoading = true;
      await authService.signInWithEmail(email, password);
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    } finally {
      isLoading = false;
    }
  }

  async function handleGoogleSignIn() {
    try {
      isLoading = true;
      await authService.signInWithGoogle();
    } catch (error) {
      alert('Google sign in failed: ' + error.message);
    } finally {
      isLoading = false;
    }
  }
</script>

<Card.Card class="max-w-md mx-auto">
  <Card.Header class="text-center">
    <div class="text-4xl mb-4">🚣</div>
    <Card.Title>Sign In to MSOE Rowing</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <div class="space-y-2">
      <Input bind:value={email} type="email" placeholder="Email" />
      <Input bind:value={password} type="password" placeholder="Password" />
      <Button.Button 
        class="w-full" 
        onclick={handleEmailSignIn} 
        disabled={isLoading || !email || !password}
      >
        Sign In with Email
      </Button.Button>
    </div>
    
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">Or</span>
      </div>
    </div>

    <Button.Button 
      variant="outline" 
      class="w-full" 
      onclick={handleGoogleSignIn} 
      disabled={isLoading}
    >
      Sign In with Google
    </Button.Button>
  </Card.Content>
</Card.Card>
```

## Step 7: Update App.svelte for Auth State

```svelte
<script>
  import { onMount } from 'svelte';
  import { authService } from './services/auth.js';
  import { initializeApp } from './utils/store.js';
  import Login from './components/Login.svelte';
  // ... other imports

  let user = null;
  let isLoading = true;

  onMount(() => {
    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        user = authUser;
        await initializeApp();
      } else {
        user = null;
      }
      isLoading = false;
    });

    return unsubscribe;
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="text-4xl mb-4">🚣</div>
      <p>Loading...</p>
    </div>
  </div>
{:else if !user}
  <div class="min-h-screen flex items-center justify-center p-4">
    <Login />
  </div>
{:else}
  <!-- Your existing app content -->
{/if}
```

## Step 8: Update Firestore Security Rules

Update `firestore.rules` for authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.authUid || 
         request.auth.uid == request.resource.data.authUid);
    }
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(resource.data.userId)) &&
        get(/databases/$(database)/documents/users/$(resource.data.userId)).data.authUid == request.auth.uid;
    }
  }
}
```

## Step 9: Deploy Updated Rules

```bash
firebase deploy --only firestore
```

## Benefits After Setup

✅ **Secure Access**: Only authenticated users can use the app
✅ **Data Protection**: Users can only edit their own sessions
✅ **Team Management**: Admin control over who can access
✅ **Professional**: Proper user accounts for team members
✅ **Scalable**: Ready for larger team deployment

## Next Steps After Auth

1. **Admin Panel**: Create admin interface for user management
2. **Team Invites**: Email invitations for new team members
3. **Role-based Access**: Different permissions for coaches vs athletes
4. **Profile Pictures**: Add user avatars via Firebase Storage
