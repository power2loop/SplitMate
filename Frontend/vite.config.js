import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // SPA calls like fetch('/api/users/register') will be proxied in dev
      '/api': {
        target: 'http://localhost:5000', // your Express port
        changeOrigin: true,
        // rewrite: (p) => p.replace(/^\/api/, ''), // only if backend does NOT include /api
      },
    },
  },
})
