// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]],
      },
      include: /\.(js|jsx)$/,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // or use '0.0.0.0'
  },
});
