import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server forwards /api/* to Flask, so the browser (and your phone) only
// ever talks to one origin. host:true exposes the dev server on your Wi-Fi network.
const backend = 'http://127.0.0.1:5000';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173, proxy: { '/api': { target: backend, changeOrigin: true } } },
  preview: { host: true, port: 4173, proxy: { '/api': { target: backend, changeOrigin: true } } },
});
