import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}']
      },
      includeAssets: ['src/assets/MSOE_logo.svg', 'src/assets/raiders_logo.svg'],
      manifest: {
        name: 'MSOE Rowing Team Companion',
        short_name: 'MSOE Rowing',
        description: 'Track meters rowed and view team leaderboards for MSOE Rowing',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/src/assets/MSOE_logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/src/assets/MSOE_logo.svg',
            sizes: '512x512', 
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
  build: { outDir: 'dist' }
});
