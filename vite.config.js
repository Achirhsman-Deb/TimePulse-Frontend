import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
        port: process.env.PORT || 3000, // Use the PORT environment variable
        host: true, // Allow network access
        proxy: {
          '/api': {
            target: 'https://timepulse-backend.onrender.com/',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Removes the /api prefix
          },
        },
  },
})
