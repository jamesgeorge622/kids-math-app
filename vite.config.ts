import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon.png'],
            manifest: {
                name: 'Brain Buddy: Kids Learning',
                short_name: 'BrainBuddy',
                description: 'Fun math and logic adventures for kids!',
                theme_color: '#8B5CF6',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'icon.png',
                        sizes: '192x192 512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
})
