import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ["./public/image.png", 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Chayo',
        short_name: 'chayo',
        description: 'My Awesome Progressive Web App!',
        theme_color: '#000000',
        icons: [
          {
            src: "./public/image.png",
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: "./public/image.png",
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
});