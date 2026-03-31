import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/cannon'],
          'vendor-motion': ['framer-motion'],
          'data-core': [
            './src/data/backgrounds.json',
            './src/data/classDetails.json',
            './src/data/classesSummary.json',
            './src/data/species.json',
            './src/data/talents.json',
            './src/data/equipment.json',
            './src/data/weapons.json',
            './src/data/armor.json',
            './src/data/magicItems.json',
          ],
        },
      },
    },
  },
})
