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
    'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'] || 'production'),
  },
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      // CI環境でも動作するように修正
      '@ffmpeg/core$':
        process.env['NODE_ENV'] === 'production'
          ? '@ffmpeg/core/dist/umd/ffmpeg-core.js'
          : path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$':
        process.env['NODE_ENV'] === 'production'
          ? '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'
          : path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
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
