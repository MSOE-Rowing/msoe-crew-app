// Demo data utility for testing the rowing app

import { db } from '../services/database.js';

export async function addDemoData() {
  try {
    // Check if demo data already exists
    const users = await db.getUsers();
    if (users.length > 0) {
      return; // Demo data already exists
    }

    // Add demo users
    const user1Id = await db.addUser('Alex River', 'Crushing it! 💪');
    const user2Id = await db.addUser('Jordan Stroke', 'Feeling strong today 🔥');
    const user3Id = await db.addUser('Sam Waters', 'Ready for the 2K 🚣‍♀️');
    const user4Id = await db.addUser('Casey Row', 'Training hard! ⚡');

    // Add demo sessions
    const now = new Date();
    
    // Alex's sessions
    await db.addSession(user1Id, 5000, new Date(now - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
    await db.addSession(user1Id, 2000, new Date(now - 5 * 24 * 60 * 60 * 1000)); // 5 days ago
    await db.addSession(user1Id, 6000, new Date(now - 3 * 24 * 60 * 60 * 1000)); // 3 days ago
    await db.addSession(user1Id, 2000, new Date(now - 1 * 24 * 60 * 60 * 1000)); // 1 day ago

    // Jordan's sessions
    await db.addSession(user2Id, 10000, new Date(now - 6 * 24 * 60 * 60 * 1000)); // 6 days ago
    await db.addSession(user2Id, 5000, new Date(now - 4 * 24 * 60 * 60 * 1000)); // 4 days ago
    await db.addSession(user2Id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000)); // 2 days ago

    // Sam's sessions
    await db.addSession(user3Id, 6000, new Date(now - 8 * 24 * 60 * 60 * 1000)); // 8 days ago
    await db.addSession(user3Id, 2000, new Date(now - 6 * 24 * 60 * 60 * 1000)); // 6 days ago
    await db.addSession(user3Id, 5000, new Date(now - 1 * 24 * 60 * 60 * 1000)); // 1 day ago

    // Casey's sessions
    await db.addSession(user4Id, 2000, new Date(now - 4 * 24 * 60 * 60 * 1000)); // 4 days ago
    await db.addSession(user4Id, 2000, new Date(now - 2 * 24 * 60 * 60 * 1000)); // 2 days ago

    console.log('Demo data added successfully!');
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
