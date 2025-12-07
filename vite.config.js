import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gestasai.com',
        changeOrigin: true,
        secure: false,
      },
      '/bridge': {
        target: 'https://gestasai.com',
        changeOrigin: true,
        secure: false,
      },
      '/universal': {
        target: 'https://gestasai.com',
        changeOrigin: true,
        secure: false,
      },
      '/acide': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
