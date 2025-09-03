## Admin

Single source: `src/config/admin.js`

### Add / Remove
```js
export const ADMIN_UIDS = [
   'ExistingUID',
   'AnotherUID'
];
```

### Apply Changes
```bash
npm run update-admin   # regenerate rules
npm run deploy:rules   # deploy rules
```

### Find a UID
- User signs in → check browser console
- Firebase Console → Authentication
- Firestore `users` doc `authUid`

### Capabilities
- Add / delete workouts for any user
- Access Admin tab
- Broad read/write per rules template

### Reminders
- Run update + deploy after edits
- Use exact Firebase Auth UIDs
- Verify in dev before deploying
