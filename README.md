# MSOE Rowing Team Companion

Progressive Web App for tracking meters rowed, viewing the season leaderboard, and managing rowing profiles.

## Core Features

| Category | Highlights |
|----------|-----------|
| Logging | Quick distance presets (2K / 5K / 6K / 10K), manual entry |
| Leaderboard | Ranked season totals, self highlighting |
| Profiles | Status message, session history, delete sessions |
| Admin | Add / remove workouts for any user (UID controlled) |
| PWA | Installable, offline cache, update prompt |
| Auth | Email + password w/ @msoe.edu enforcement + verification |

## Tech Stack

Svelte 5, Vite, TailwindCSS, shadcn-svelte components, Firebase Auth + Firestore, Firebase Hosting, service-worker powered PWA.

## Quick Start

```bash
cp .env.example .env        # Fill with Firebase values
npm install                 # Install dependencies
npm run dev                 # Start dev server (http://localhost:5173)
```

Production build & deploy (Firebase Hosting):
```bash
npm run build
npm run deploy        # or: npm run deploy:hosting
```

## Environment Variables

All Firebase config lives in `.env` (see `./.env.example`). Variables must be prefixed with `VITE_` to be exposed to the client. See `docs/ENVIRONMENT.md` for the full list and sourcing steps.

## Admin Users

Admin UIDs are defined in `src/config/admin.js`. After editing:
```bash
npm run update-admin   # Regenerate rules from config
npm run deploy:rules   # Deploy Firestore rules
```
Doc: `docs/ADMIN.md` (kept minimal).

## Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run deploy       # Build + deploy hosting & rules
npm run deploy:hosting
npm run update-admin
npm run deploy:rules
```

## PWA Notes

Offline reads & queued writes via Firestore caching. Users get an update prompt when a new service worker activates. Install via browser (desktop install icon or mobile Add to Home Screen).

## Project Structure (trimmed)
```
src/
	components/     # Feature components
	lib/            # Reusable UI + utils
	services/       # Firebase wrappers
	utils/          # Stores & navigation
	config/         # Admin + runtime config
docs/             # Minimal remaining docs (ENVIRONMENT, ADMIN)
```

## Contributing (Internal)
1. Copy `.env.example` → `.env`
2. Run `npm run dev`
3. Make focused changes (avoid complexity creep)
4. Test auth + logging + leaderboard
5. Deploy when stable

## License / Usage
Internal tool for the MSOE Rowing Team.

## Motto
**DAY BY DAY!** 🚣‍♀️

Row. Log. Improve.
