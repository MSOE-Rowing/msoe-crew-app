# MSOE Rowing Team Companion

A Progressive Web App (PWA) for tracking meters rowed and viewing team leaderboards for the MSOE Rowing team.

## Features

- 📊 **Season Leaderboard** - View team rankings based on total meters rowed with custom user statuses
- ➕ **Log Meters** - Record your rowing sessions with preset distances (2K, 5K, 6K, 10K)
- 👤 **User Profiles** - Create and manage your rowing profile with editable status messages
- 📱 **Progressive Web App** - Install on your phone for native app-like experience
- 🔄 **Offline Support** - Works offline and syncs when reconnected
- 🎯 **Real-time Updates** - Automatic updates when new versions are available

## PWA Features

### Installation
- **Mobile**: Visit the app in your browser and tap "Add to Home Screen" when prompted
- **Desktop**: Look for the install icon in your browser's address bar
- **Custom Prompt**: The app shows an install prompt when appropriate

### Offline Functionality
- All data stored locally using IndexedDB
- Works completely offline once installed
- Offline notification bar appears when disconnected
- Changes sync automatically when back online

### Updates
- Automatic update checks when online
- Update notifications appear when new versions are available
- Updates install seamlessly in the background

## Development

### Getting Started
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

## Technologies Used

- **Frontend**: Svelte 5, TailwindCSS
- **UI Components**: shadcn-svelte
- **Database**: IndexedDB (local storage)
- **PWA**: Vite PWA plugin with Workbox
- **Build Tool**: Vite

## Team Motto

**DAY BY DAY!** 🚣‍♀️

Track your progress and watch those meters add up, day by day!
