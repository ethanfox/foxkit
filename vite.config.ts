import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const base = '/foxkit/'

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: base,
  },
  preview: {
    open: base,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      minify: false,
      includeAssets: [
        'favicon.svg',
        'brand/foxkit-wordmark.svg',
        'brand/foxkit-mark.svg',
        'icons/app-icon.svg',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-512.png',
      ],
      manifest: {
        name: 'FoxKit',
        short_name: 'FoxKit',
        description: 'Small visual tools that run entirely in your browser.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        id: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: `${base}index.html`,
      },
    }),
    {
      name: 'spa-github-pages-fallback',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
})
