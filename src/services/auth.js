import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';

// Set persistence to LOCAL to ensure users stay logged in across sessions
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

export const authService = {
  // Initialize auth persistence - call this early in app lifecycle
  async initializePersistence() {
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('✅ Auth persistence set to LOCAL - users will stay logged in');
      return true;
    } catch (error) {
      console.error('❌ Failed to set auth persistence:', error);
      return false;
    }
  },

  // Check if user is already authenticated (useful for app startup)
  getCurrentAuthState() {
    const user = auth.currentUser;
    if (user) {
      console.log('👤 User already authenticated:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      });
    } else {
      console.log('👤 No authenticated user found');
    }
    return user;
  },
  // Sign in with email/password
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      // Handle specific auth errors
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please enable it in Firebase Console.');
      }
      throw error;
    }
  },

  // Create account with email/password
  async signUpWithEmail(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      // Handle specific auth errors
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please enable it in Firebase Console.');
      }
      throw error;
    }
  },

  // Sign out
  async signOut() {
    return await signOut(auth);
  },

  // Send email verification
  async sendEmailVerification() {
    const user = auth.currentUser;
    if (user) {
      console.log('Sending verification email to:', user.email);
      try {
        await sendEmailVerification(user, {
          url: window.location.origin, // Redirect back to app after verification
          handleCodeInApp: false
        });
        console.log('Verification email sent successfully');
        return true;
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
      }
    }
    throw new Error('No user is currently signed in');
  },

  // Resend verification email for a specific email (requires temporary sign in)
  async resendVerificationEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      return true;
    } catch (error) {
      throw error;
    }
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
