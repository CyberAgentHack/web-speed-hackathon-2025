import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    base: '/public/',
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      target: ['chrome134'],
    },
    define: {
      'process.env': {
        API_BASE_URL: process.env['API_BASE_URL'],
      },
    },
    plugins: [react()],
  };
});
