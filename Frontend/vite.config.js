import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ import these two lines for ESM
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// ✅ recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
