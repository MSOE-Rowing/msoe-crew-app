# MSOE Rowing Team Companion

A secure Progressive Web App (PWA) for tracking meters rowed and viewing team leaderboards for the MSOE Rowing team.

## Features

- 🔐 **Secure Authentication** - Email/password sign-in with Firebase Authentication
- 📊 **Season Leaderboard** - View team rankings based on total meters rowed  
- ➕ **Log Meters** - Record your rowing sessions with preset distances (2K, 5K, 6K, 10K)
- 👤 **User Profiles** - Create and manage your rowing profile with session history
- �️ **Admin Panel** - Admin users can manage workouts for any user
- �🗑️ **Session Management** - Delete sessions from your profile
- 📱 **Progressive Web App** - Install on your phone for native app-like experience
- 🔄 **Real-time Sync** - Data syncs in real-time across all devices using Firebase Firestore
- 🌐 **Offline Support** - Works offline with automatic sync when reconnected
- 🎯 **Automatic Updates** - Automatic updates when new versions are available
- ✉️ **Email Verification** - Required @msoe.edu email with verification before access

## Tech Stack

- **Frontend**: Svelte 5 + Vite
- **UI Components**: shadcn-svelte + Tailwind CSS
- **Authentication**: Firebase Auth with email verification
- **Database**: Firebase Firestore with security rules
- **Hosting**: Firebase Hosting
- **PWA**: Service Worker for offline support

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration
# See docs/ENVIRONMENT.md for details
```

### 2. Development
```bash
npm install
npm run dev
```

### 3. Production Build
```bash
npm run build
npm run deploy
```

## Documentation

📚 **Complete documentation is available in the [`docs/`](docs/) folder:**

- **[Environment Setup](docs/ENVIRONMENT.md)** - Environment variables and Firebase config
- **[Authentication Setup](docs/EMAIL_AUTH_SETUP.md)** - Firebase Auth configuration  
- **[Firebase Setup](docs/FIREBASE_SETUP.md)** - Complete Firebase project setup
- **[Firestore Setup](docs/FIRESTORE_SETUP.md)** - Database and security rules
- **[Admin Management](docs/ADMIN.md)** - Managing admin users
- **[Deployment](docs/DEPLOYMENT.md)** - Production deployment guide
- **[Troubleshooting](docs/AUTH_TROUBLESHOOTING.md)** - Common issues and solutions

## Project Structure

```
rowing-leaderboard-app/
├── src/
│   ├── components/          # Svelte components
│   ├── lib/                # Utility libraries and UI components  
│   ├── services/           # Firebase services
│   ├── utils/              # Store and utilities
│   └── config/             # Configuration files
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── public/                 # Static assets
└── firestore.rules        # Database security rules
```

## Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run deploy          # Build and deploy to Firebase
npm run update-admin    # Update Firestore rules from admin config
npm run deploy:rules    # Update and deploy Firestore rules
```

## Contributing

1. Copy `.env.example` to `.env` and configure your Firebase project
2. Follow the setup guides in the `docs/` folder  
3. Make your changes
4. Test thoroughly before deploying

## License

This project is for the MSOE Rowing Team.

## Documentation

Detailed setup and configuration guides are available in the [`docs/`](docs/) folder:

- [Firebase Setup](docs/FIREBASE_SETUP.md) - Initial project setup
- [Email Auth Setup](docs/EMAIL_AUTH_SETUP.md) - Authentication configuration  
- [Auth Troubleshooting](docs/AUTH_TROUBLESHOOTING.md) - Common issues and solutions

## PWA Features

### Installation
- **Mobile**: Visit the app in your browser and tap "Add to Home Screen" when prompted
- **Desktop**: Look for the install icon in your browser's address bar
- **Custom Prompt**: The app shows an install prompt when appropriate

### Offline Functionality
- All data stored in Firebase Firestore with offline caching
- Works offline once installed with automatic sync
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

### Firebase Deployment
```bash
# Deploy to Firebase Hosting
npm run deploy

# Deploy only hosting (faster)
npm run deploy:hosting
```

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase configuration.

## Technologies Used

- **Frontend**: Svelte 5, TailwindCSS
- **UI Components**: shadcn-svelte
- **Database**: Firebase Firestore (real-time NoSQL database)
- **Hosting**: Firebase Hosting
- **PWA**: Vite PWA plugin with Workbox
- **Build Tool**: Vite

## Team Motto

**DAY BY DAY!** 🚣‍♀️

Track your progress and watch those meters add up, day by day!
