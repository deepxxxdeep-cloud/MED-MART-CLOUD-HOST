import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy the API through the dev server so the app and API share an
    // origin: no CORS preflight, and the auth cookie is first-party.
    proxy: {
      "/api": {
        // NOTE: not port 5000 — macOS AirPlay Receiver squats on it and
        // answers 403. Disable it in System Settings or keep this port.
        target: process.env.VITE_API_PROXY || "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
})
