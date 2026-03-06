import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Allows Firebase Auth popup (Google sign-in) to work despite COOP
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
