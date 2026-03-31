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
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/canvas-confetti')) {
            return 'vendor-confetti';
          }
          if (id.includes('/data/') && (id.endsWith('.json') || id.endsWith('.ts')) && !id.includes('spells/')) {
            return 'data-core';
          }
          if (id.includes('/rules/calculators/')) {
            return 'rules-calculators';
          }
          if (id.includes('/rules/data/') || id.includes('/rules/utils/') || id.includes('/rules/types/') || id.includes('/rules/engine/')) {
            return 'rules-data';
          }
        },
      },
    },
  },
})
