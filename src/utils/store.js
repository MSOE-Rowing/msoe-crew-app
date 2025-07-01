import { writable } from 'svelte/store';
import { db } from '../services/database.js';
import { addDemoData } from './demo.js';

// Current user store
export const currentUser = writable(null);

// Users store
export const users = writable([]);

// Sessions store  
export const sessions = writable([]);

// Leaderboard store
export const leaderboard = writable([]);

// Loading states
export const isLoading = writable(false);

// Initialize the database and load initial data
export async function initializeApp() {
  try {
    isLoading.set(true);
    await db.init();
    
    // Load users and leaderboard
    await refreshLeaderboard();
    await refreshUsers();
    
    // Load current user from localStorage if exists
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const allUsers = await db.getUsers();
      const user = allUsers.find(u => u.id === parseInt(savedUserId));
      if (user) {
        currentUser.set(user);
      }
    }

    // Add demo data if no users exist
    const allUsers = await db.getUsers();
    if (allUsers.length === 0) {
      await addDemoData();
      await refreshUsers();
      await refreshLeaderboard();
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
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

export async function addNewUser(name, status = 'Ready to row! 🚣') {
  try {
    const userId = await db.addUser(name, status);
    await refreshUsers();
    await refreshLeaderboard();
    return userId;
  } catch (error) {
    console.error('Failed to add user:', error);
    throw error;
  }
}

export async function logMeters(userId, meters) {
  try {
    await db.addSession(userId, meters);
    await refreshLeaderboard();
    return true;
  } catch (error) {
    console.error('Failed to log meters:', error);
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
  if (user) {
    localStorage.setItem('currentUserId', user.id.toString());
  } else {
    localStorage.removeItem('currentUserId');
  }
}
