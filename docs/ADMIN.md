# Admin Management

## Single Source of Truth: `/src/config/admin.js`

All admin user UIDs are managed in one place: **`/src/config/admin.js`**

## How to Add/Remove Admins

1. **Edit `/src/config/admin.js`**:
   ```javascript
   export const ADMIN_UIDS = [
     'EM9cVTpG7BQQkUZtcaSmqeTx5cT2', // Your UID
     'newAdminUID123456789',          // Add new admin here
     // Add more admin UIDs as needed
   ];
   ```

2. **Update Firestore Rules**:
   ```bash
   npm run update-admin
   ```

3. **Deploy the Updated Rules**:
   ```bash
   npm run deploy:rules
   ```
   
   Or deploy manually:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Quick Commands

- **Update rules from config**: `npm run update-admin`
- **Update + deploy rules**: `npm run deploy:rules`

## How to Find a User's UID

1. Have the user sign in to the app
2. Check the browser console for their UID
3. Or check the Firebase Authentication console
4. Or check the `authUid` field in the Firestore `users` collection

## Admin Permissions

Admins can:
- ✅ View the Admin tab in the app
- ✅ Add workouts for any user
- ✅ Delete workouts for any user
- ✅ Read/write all Firestore data
- ✅ Bypass normal security rules

## Important Notes

- ⚠️ **Always run `npm run update-admin` after changing admin UIDs**
- ⚠️ **Deploy the updated rules to apply changes in production**
- ⚠️ **Admin UIDs must be exact Firebase Auth UIDs**
- ⚠️ **Test admin permissions in development before deploying**
