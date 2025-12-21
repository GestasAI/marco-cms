import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'https://gestasai.com';
  const acideUrl = env.VITE_ACIDE_URL || 'http://localhost:9000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/bridge': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/universal': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/acide': {
          target: acideUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
