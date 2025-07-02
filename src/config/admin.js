// Admin configuration
// ⚠️  IMPORTANT: After changing admin UIDs, run: npm run update-admin
// This will automatically update the Firestore security rules

// Add admin user UIDs here
export const ADMIN_UIDS = [
  '0CHyV5tueMWepL0jwzmEQpywvOr2',
  'QxuEp0xPVVMZ3Jtao36FzVeAV4E3'
  // Add more admin UIDs here as needed
];

// Check if a user UID is an admin
export function isAdmin(uid) {
  return ADMIN_UIDS.includes(uid);
}
