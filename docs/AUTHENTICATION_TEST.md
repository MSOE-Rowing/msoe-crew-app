# Authentication Testing Guide

## Testing the Authentication Flow

1. **Open the app**: http://localhost:5173/

2. **Test Sign Up**:
   - Click the "Sign Up" tab
   - Enter a test email (e.g., test@msoe.edu)
   - Enter a password (min 6 characters)
   - Confirm the password
   - Click "Create Account"
   - Should redirect to profile creation

3. **Test Profile Creation**:
   - Enter your name
   - Click "Create Profile"
   - Should redirect to the main app

4. **Test Main App Functions**:
   - Try logging meters
   - Check the leaderboard
   - View your profile
   - Test deleting a session from your profile

5. **Test Sign Out**:
   - Click "Sign Out" button
   - Should return to login screen

6. **Test Sign In**:
   - Use the same email/password
   - Should log you in and show your existing profile

## Firebase Console Verification

1. Go to [Firebase Console](https://console.firebase.google.com/project/rowing-leaderboard-app)
2. Check **Authentication** > **Users** to see registered users
3. Check **Firestore Database** > **Data** to see user profiles and sessions
4. Verify that user profiles have `authUid` field linking to Firebase Auth

## Security Testing

- Try accessing data without authentication (should fail)
- Try editing another user's data (should fail)
- Verify Firestore security rules are working correctly

## Common Issues

1. **Build errors**: Check import statements and component syntax
2. **Authentication errors**: Verify Firebase config and enable email/password auth
3. **Firestore errors**: Check security rules and indexes
4. **UI issues**: Verify shadcn-svelte components are properly imported

## Success Criteria

✅ Users can sign up with email/password
✅ Users can create their rowing profiles  
✅ Users can sign in/out successfully
✅ All CRUD operations work (log meters, view leaderboard, delete sessions)
✅ Data is secure (users can only edit their own data)
✅ Offline/PWA features still work
✅ App is ready for production deployment
