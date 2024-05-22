import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
      '/document/v1': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
      '/role/v1': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
