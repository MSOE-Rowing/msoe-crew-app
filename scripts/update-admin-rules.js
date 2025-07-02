#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import admin config
const adminConfigPath = join(__dirname, '../src/config/admin.js');
const adminConfig = await import(`file://${adminConfigPath}`);
const adminUIDs = adminConfig.ADMIN_UIDS;

// Read the current firestore.rules template
const rulesTemplatePath = join(__dirname, '../firestore.rules.template');
const rulesPath = join(__dirname, '../firestore.rules');

// Create template if it doesn't exist
const rulesTemplate = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.uid in [
        {{ADMIN_UIDS}}
      ];
    }
    
    // Users collection - allow read for all, write only for authenticated users with correct authUid or admins
    match /users/{userId} {
      allow read: if true; // Allow reading for leaderboard
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.authUid || request.auth.uid == request.resource.data.authUid || isAdmin());
      allow create: if request.auth != null && 
        (request.auth.uid == request.resource.data.authUid || isAdmin());
    }
    
    // Sessions collection - allow read for all, write/delete for session owners or admins
    match /sessions/{sessionId} {
      allow read: if true; // Allow reading for leaderboard
      allow write, delete: if request.auth != null && 
        (request.auth.uid == get(/databases/$(database)/documents/users/$(resource.data.userId)).data.authUid || isAdmin());
      allow create: if request.auth != null && 
        (request.auth.uid == get(/databases/$(database)/documents/users/$(request.resource.data.userId)).data.authUid || isAdmin());
    }
  }
}`;

// Format admin UIDs for Firestore rules
const formattedUIDs = adminUIDs.map(uid => `        '${uid}'`).join(',\n');

// Replace placeholder in template
const updatedRules = rulesTemplate.replace('{{ADMIN_UIDS}}', formattedUIDs);

// Write the updated rules
writeFileSync(rulesPath, updatedRules);

console.log('✅ Firestore rules updated successfully!');
console.log(`📝 Updated admin UIDs: ${adminUIDs.length} total`);
console.log(`🔥 Don't forget to deploy with: firebase deploy --only firestore:rules`);
