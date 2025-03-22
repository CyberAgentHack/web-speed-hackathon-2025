import path from 'node:path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.wasm'],
  build: {
    rollupOptions: {
      plugins: [
        mode === 'analyze' &&
          visualizer({
            brotliSize: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            open: true,
          }),
      ],
    },
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'] || 'development'),
  },
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      '@ffmpeg/core': path.resolve(__dirname, 'node_modules', '@ffmpeg/core'),
    },
  },
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:8000',
      },
      '/public': {
        changeOrigin: true,
        target: 'http://localhost:8000',
      },
    },
  },
}));
