// Database service for storing rowing data using Firebase Firestore

import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  runTransaction,
  Timestamp
} from 'firebase/firestore';
import { db as firestore } from '../lib/firebase.js';

class RowingDB {
  constructor() {
    this.db = firestore;
    this.usersCollection = 'users';
    this.sessionsCollection = 'sessions';
  }

  async init() {
    // Firebase automatically handles initialization
    // No explicit init needed like with IndexedDB
    return Promise.resolve();
  }

  async addUser(name, status = 'Ready to row! 🚣', authUid = null) {
    try {
      const user = {
        name,
        status,
        createdAt: serverTimestamp(),
        totalMeters: 0,
        authUid: authUid || null
      };

      const docRef = await addDoc(collection(this.db, this.usersCollection), user);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.usersCollection));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async getUserByAuthUid(authUid) {
    try {
      const q = query(
        collection(this.db, this.usersCollection),
        where('authUid', '==', authUid)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error getting user by auth UID:', error);
      throw error;
    }
  }

  async addSession(userId, meters, date = new Date()) {
    try {
      const session = {
        userId,
        meters,
        date: Timestamp.fromDate(date), // Convert Date to Firestore Timestamp
        createdAt: serverTimestamp()
      };

      // Add the session first
      const sessionRef = await addDoc(collection(this.db, this.sessionsCollection), session);
      
      // Then update the user's total meters
      await this.updateUserTotalMeters(userId);
      
      return sessionRef.id;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  async getSessions(userId = null) {
    try {
      let querySnapshot;
      
      if (userId) {
        // Simple query by userId only (no ordering to avoid composite index requirement)
        const q = query(
          collection(this.db, this.sessionsCollection),
          where('userId', '==', userId)
        );
        querySnapshot = await getDocs(q);
      } else {
        // Get all sessions with ordering
        const q = query(
          collection(this.db, this.sessionsCollection),
          orderBy('date', 'desc')
        );
        querySnapshot = await getDocs(q);
      }

      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If we queried by userId, sort the results in JavaScript
      if (userId) {
        sessions.sort((a, b) => {
          // Handle Firestore Timestamps properly
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA; // Descending order (newest first)
        });
      }

      return sessions;
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  }

  async updateUserTotalMeters(userId) {
    try {
      const sessions = await this.getSessions(userId);
      const totalMeters = sessions.reduce((sum, session) => sum + session.meters, 0);

      const userRef = doc(this.db, this.usersCollection, userId);
      await updateDoc(userRef, { totalMeters });
    } catch (error) {
      console.error('Error updating user total meters:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const userRef = doc(this.db, this.usersCollection, userId);
      await updateDoc(userRef, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async getLeaderboard() {
    try {
      const users = await this.getUsers();
      return users
        .sort((a, b) => (b.totalMeters || 0) - (a.totalMeters || 0))
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Additional helper method to get a single user
  async getUser(userId) {
    try {
      const userRef = doc(this.db, this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Delete a session and update user's total meters
  async deleteSession(sessionId) {
    try {
      // First get the session to know which user to update
      const sessionRef = doc(this.db, this.sessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }
      
      const sessionData = sessionDoc.data();
      const userId = sessionData.userId;
      
      // Delete the session
      await deleteDoc(sessionRef);
      
      // Update the user's total meters
      await this.updateUserTotalMeters(userId);
      
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

export const db = new RowingDB();
