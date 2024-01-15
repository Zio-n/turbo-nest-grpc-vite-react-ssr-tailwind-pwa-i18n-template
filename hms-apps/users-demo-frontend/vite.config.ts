import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src/custom-sw',
    filename: 'my-sw.ts'
  })],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./@"),
    },
  },
})

