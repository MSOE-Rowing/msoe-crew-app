import { writable, get } from 'svelte/store';
import { db } from '../services/database.js';
import { authService } from '../services/auth.js';
import { addDemoData } from './demo.js';
import { isAdmin } from '../config/admin.js';

// Authentication state
export const authUser = writable(null);
export const isAuthenticated = writable(false);
export const isAdminUser = writable(false);

// Current user profile store
export const currentUser = writable(null);

// Users store
export const users = writable([]);

// Sessions store  
export const sessions = writable([]);

// Leaderboard store
export const leaderboard = writable([]);

// Loading states
export const isLoading = writable(false);
export const authLoading = writable(true);

// Email verification error state
export const emailVerificationError = writable(false);

// Initialize authentication listener
export function initializeAuth() {
  console.log('🔐 Initializing auth state listener...');
  
  return authService.onAuthStateChanged(async (user) => {
    console.log('🔄 Auth state changed, processing...', user ? `User: ${user.email}` : 'No user');
    authLoading.set(true);
    
    if (user) {
      console.log('Auth state changed:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      });
      
      // TEMPORARY: Skip email verification check for development
      // TODO: Re-enable email verification in production
      const skipVerification = false; // Set to false to test email verification
      
      // Check if email is verified (unless bypassed for development)
      if (!skipVerification && !user.emailVerified) {
        console.log('User email not verified, signing out and setting error flag');
        emailVerificationError.set(true);
        await authService.signOut();
        authLoading.set(false);
        return;
      }
      
      // Clear any previous email verification error
      emailVerificationError.set(false);
      
      // User is signed in and verified (or verification bypassed)
      authUser.set(user);
      isAuthenticated.set(true);
      isAdminUser.set(isAdmin(user.uid));
      
      // Try to get user profile from Firestore
      try {
        const userProfile = await db.getUserByAuthUid(user.uid);
        if (userProfile) {
          currentUser.set(userProfile);
        } else {
          // User doesn't have a profile yet, will need to create one
          currentUser.set(null);
        }
      } catch (error) {
        console.error('Failed to get user profile:', error);
        currentUser.set(null);
      }
    } else {
      // User is signed out
      authUser.set(null);
      isAuthenticated.set(false);
      isAdminUser.set(false);
      currentUser.set(null);
    }
    
    authLoading.set(false);
  });
}

// Initialize the database and load initial data
export async function initializeApp() {
  try {
    isLoading.set(true);
    await db.init();
    
    // Load users and leaderboard
    await refreshLeaderboard();
    await refreshUsers();
    
    // Add demo data if no users exist
    const allUsers = await db.getUsers();
    if (allUsers.length === 0) {
      await addDemoData();
      await refreshUsers();
      await refreshLeaderboard();
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Don't throw the error, let the app continue to work in auth mode
  } finally {
    isLoading.set(false);
  }
}

export async function refreshUsers() {
  try {
    const allUsers = await db.getUsers();
    users.set(allUsers);
  } catch (error) {
    console.error('Failed to refresh users:', error);
  }
}

export async function refreshLeaderboard() {
  try {
    const board = await db.getLeaderboard();
    leaderboard.set(board);
  } catch (error) {
    console.error('Failed to refresh leaderboard:', error);
  }
}

export async function addNewUser(name, status = 'Ready to row! 🚣', authUid = null) {
  try {
    const userId = await db.addUser(name, status, authUid);
    await refreshUsers();
    await refreshLeaderboard();
    
    // If this is for the current authenticated user, update the current user
    if (authUid) {
      const newUser = await db.getUserByAuthUid(authUid);
      if (newUser) {
        currentUser.set(newUser);
      }
    }
    
    return userId;
  } catch (error) {
    console.error('Failed to add user:', error);
    throw error;
  }
}

export async function logMeters(userId, meters) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!meters || meters <= 0) {
      throw new Error('Meters must be a positive number');
    }
    
    await db.addSession(userId, meters);
    await refreshLeaderboard();
    await refreshUsers();
    
    // Update the current user with fresh data if it's the user who logged meters
    currentUser.update(user => {
      if (user && user.id === userId) {
        // Find the updated user from the refreshed users list
        const allUsers = get(users);
        const updatedUser = allUsers.find(u => u.id === userId);
        return updatedUser || user;
      }
      return user;
    });
    
    return true;
  } catch (error) {
    console.error('Failed to log meters:', error);
    throw error;
  }
}

export async function deleteSession(sessionId) {
  try {
    await db.deleteSession(sessionId);
    await refreshLeaderboard();
    await refreshUsers();
    
    // Update the current user with fresh data
    const currentUserId = get(currentUser)?.id;
    if (currentUserId) {
      currentUser.update(user => {
        if (user) {
          const allUsers = get(users);
          const updatedUser = allUsers.find(u => u.id === currentUserId);
          return updatedUser || user;
        }
        return user;
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete session:', error);
    throw error;
  }
}

export async function updateUserStatus(userId, status) {
  try {
    await db.updateUserStatus(userId, status);
    await refreshUsers();
    await refreshLeaderboard();
    
    // Update current user if it's the one being updated
    const updatedUsers = await db.getUsers();
    const updatedUser = updatedUsers.find(u => u.id === userId);
    
    currentUser.update(user => {
      if (user && user.id === userId) {
        return updatedUser;
      }
      return user;
    });
    
    return true;
  } catch (error) {
    console.error('Failed to update user status:', error);
    throw error;
  }
}

export function setCurrentUser(user) {
  currentUser.set(user);
}

// Sign out function
export async function signOut() {
  try {
    await authService.signOut();
    // Auth state will be updated automatically by the listener
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}
