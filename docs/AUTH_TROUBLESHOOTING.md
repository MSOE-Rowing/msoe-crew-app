# 🔥 Firebase Authentication Setup & Troubleshooting

## Current Issues & Solutions

### 1. OAuth Domain Error (You're seeing this)
**Error**: "The current domain is not authorized for OAuth operations"

**Solution**: Add authorized domains in Firebase Console:
1. Go to: https://console.firebase.google.com/project/rowing-leaderboard-app/authentication/settings
2. Scroll to "Authorized domains" section
3. Click "Add domain" and add:
   - `localhost`
   - `127.0.0.1`
4. Click "Add" for each domain

### 2. Email/Password Authentication Not Enabled
**Error**: "operation-not-allowed" when creating accounts

**Solution**: Enable Email/Password authentication:
1. Go to: https://console.firebase.google.com/project/rowing-leaderboard-app/authentication
2. Click "Get started" (if needed)
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

## Complete Setup Checklist

### ✅ Step 1: Enable Authentication
- [ ] Go to Firebase Console Authentication
- [ ] Click "Get started"
- [ ] Enable Email/Password sign-in method

### ✅ Step 2: Add Authorized Domains
- [ ] Go to Authentication → Settings
- [ ] Add `localhost` to authorized domains
- [ ] Add `127.0.0.1` to authorized domains

### ✅ Step 3: Test the Application
- [ ] Refresh browser at http://localhost:5173/
- [ ] Open browser dev tools (F12) → Console tab
- [ ] Try creating a test account:
  - Email: test@msoe.edu
  - Password: test123
- [ ] Check console for detailed error logs

## Testing Commands

```bash
# Check Firebase project status
firebase use
firebase projects:list

# Build and test locally
npm run dev
# Visit: http://localhost:5173/
```

## Expected Error Messages & Solutions

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/operation-not-allowed` | Email/password auth disabled | Enable in Firebase Console |
| `auth/invalid-email` | Bad email format | Use valid email format |
| `auth/weak-password` | Password too short | Use 6+ characters |
| `auth/email-already-in-use` | Account exists | Try signing in instead |
| Domain authorization error | OAuth domains not added | Add localhost to authorized domains |

## Debug Information

The app now includes detailed logging. Check browser console for:
- "Auth service: attempting sign up"
- "Auth service: sign up successful"
- "Sign up error details:" (with specific error codes)

## Quick Test

1. **Enable Email/Password auth** in Firebase Console
2. **Add authorized domains** (localhost, 127.0.0.1)
3. **Refresh browser** and try creating account
4. **Check console logs** for specific errors

## Success Indicators

✅ No OAuth domain errors in console
✅ "Create Account" button works
✅ Can sign up with test@msoe.edu / test123
✅ Gets redirected to profile creation
✅ Can create rowing profile
✅ Can access main app features

## Need Help?

If you're still having issues:
1. Share the exact error message from browser console
2. Confirm you've enabled Email/Password auth in Firebase Console
3. Confirm you've added localhost to authorized domains
