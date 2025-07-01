# Deployment Guide

## Quick Deployment Options

### 1. Netlify (Recommended)
1. Build the project: `npm run build`
2. Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
3. Your PWA is live! Users can install it from their browsers

### 2. Vercel
1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Vercel will auto-detect Vite and deploy automatically
3. PWA features work out of the box

### 3. GitHub Pages
1. Build: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repo settings

### 4. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## PWA Requirements for Online Deployment

✅ **Already Configured:**
- HTTPS (automatic with most hosting providers)
- Service Worker (`sw.js`)
- Web App Manifest (`manifest.webmanifest`)
- Icons for different platforms
- Offline functionality

## Post-Deployment

After deploying:
1. Test the PWA features on mobile devices
2. Verify install prompts appear
3. Test offline functionality
4. Share the URL with your team!

## Custom Domain (Optional)

Most hosting providers allow custom domains:
- `rowing.msoe.edu` (if available)
- `msoe-rowing.com`
- Or any domain you prefer

The PWA will work with any domain once deployed!
