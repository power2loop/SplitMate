import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import 'dotenv/config.js';
import { backIn } from "framer-motion";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Backend_Uri = process.env.NODE_ENV === 'production'
  ? process.env.BACKEND_URI
  : "http://127.0.0.1:5000";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // Add base configuration for production
  base: "/",
  // Define environment variables with defaults
  define: {
    // Ensure environment variables have fallbacks
    __VITE_API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || ""),
  },
  server: {
    port: 5317,
    strictPort: true,
    open: "/landingpage",
    proxy: {
      "/api": {
        target: Backend_Uri,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Production build optimizations
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});