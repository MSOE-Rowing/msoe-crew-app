// Demo data utility for testing the rowing app

import { db } from '../services/database.js';

export async function addDemoData() {
  try {
    // Check if demo data already exists
    const users = await db.getUsers();
    if (users.length > 0) {
      console.log('Demo data already exists, skipping...');
      return; // Demo data already exists
    }

    console.log('Adding demo data...');

    // Add demo users
    const user1Id = await db.addUser('Alex River', 'Crushing it! 💪');
    const user2Id = await db.addUser('Jordan Stroke', 'Feeling strong today 🔥');
    const user3Id = await db.addUser('Sam Waters', 'Ready for the 2K 🚣‍♀️');
    const user4Id = await db.addUser('Casey Row', 'Training hard! ⚡');

    console.log('Demo users created:', { user1Id, user2Id, user3Id, user4Id });

    // Add demo sessions with a small delay to ensure users are created
    const now = new Date();
    
    console.log('Adding demo sessions...');
    
    try {
      // Alex's sessions
      await db.addSession(user1Id, 5000, new Date(now - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
      await db.addSession(user1Id, 2000, new Date(now - 5 * 24 * 60 * 60 * 1000)); // 5 days ago
      await db.addSession(user1Id, 6000, new Date(now - 3 * 24 * 60 * 60 * 1000)); // 3 days ago
      await db.addSession(user1Id, 2000, new Date(now - 1 * 24 * 60 * 60 * 1000)); // 1 day ago
      console.log('Alex sessions added');

      // Jordan's sessions
      await db.addSession(user2Id, 10000, new Date(now - 6 * 24 * 60 * 60 * 1000)); // 6 days ago
      await db.addSession(user2Id, 5000, new Date(now - 4 * 24 * 60 * 60 * 1000)); // 4 days ago
      await db.addSession(user2Id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000)); // 2 days ago
      console.log('Jordan sessions added');

      // Sam's sessions
      await db.addSession(user3Id, 6000, new Date(now - 8 * 24 * 60 * 60 * 1000)); // 8 days ago
      await db.addSession(user3Id, 2000, new Date(now - 6 * 24 * 60 * 60 * 1000)); // 6 days ago
      await db.addSession(user3Id, 5000, new Date(now - 1 * 24 * 60 * 60 * 1000)); // 1 day ago
      console.log('Sam sessions added');

      // Casey's sessions
      await db.addSession(user4Id, 2000, new Date(now - 4 * 24 * 60 * 60 * 1000)); // 4 days ago
      await db.addSession(user4Id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000)); // 2 days ago
      console.log('Casey sessions added');

      console.log('Demo data added successfully!');
    } catch (sessionError) {
      console.error('Error adding demo sessions:', sessionError);
    }
  } catch (error) {
    console.error('Failed to add demo data:', error);
  }
}

export async function clearAllData() {
  try {
    // This would require implementing a clear function in the database service
    console.log('Clear data function would go here');
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

export async function resetDemoData() {
  try {
    console.log('Resetting demo data...');
    
    // Get all users and sessions to clear them
    const users = await db.getUsers();
    const sessions = await db.getSessions();
    
    console.log(`Found ${users.length} users and ${sessions.length} sessions to clear`);
    
    // Note: We would need to implement delete functions in the database service
    // For now, we'll just add sessions to existing users
    
    if (users.length >= 4) {
      const now = new Date();
      
      // Add sessions to existing users
      const [alex, jordan, sam, casey] = users;
      
      console.log('Adding sessions to existing users...');
      
      // Alex's sessions
      await db.addSession(alex.id, 5000, new Date(now - 7 * 24 * 60 * 60 * 1000));
      await db.addSession(alex.id, 2000, new Date(now - 5 * 24 * 60 * 60 * 1000));
      await db.addSession(alex.id, 6000, new Date(now - 3 * 24 * 60 * 60 * 1000));
      await db.addSession(alex.id, 2000, new Date(now - 1 * 24 * 60 * 60 * 1000));
      
      // Jordan's sessions
      await db.addSession(jordan.id, 10000, new Date(now - 6 * 24 * 60 * 60 * 1000));
      await db.addSession(jordan.id, 5000, new Date(now - 4 * 24 * 60 * 60 * 1000));
      await db.addSession(jordan.id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000));
      
      // Sam's sessions
      await db.addSession(sam.id, 6000, new Date(now - 8 * 24 * 60 * 60 * 1000));
      await db.addSession(sam.id, 2000, new Date(now - 6 * 24 * 60 * 60 * 1000));
      await db.addSession(sam.id, 5000, new Date(now - 1 * 24 * 60 * 60 * 1000));
      
      // Casey's sessions
      await db.addSession(casey.id, 2000, new Date(now - 4 * 24 * 60 * 60 * 1000));
      await db.addSession(casey.id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000));
      
      console.log('Demo sessions added to existing users!');
    }
  } catch (error) {
    console.error('Failed to reset demo data:', error);
  }
}

// Call this function in browser console to add sessions to existing users
// window.resetDemoData = resetDemoData;
