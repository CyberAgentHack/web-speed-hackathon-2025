import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  return {
    base: '/public/',
    build: {
      minify: 'terser',
      outDir: 'dist',
      rollupOptions: {
        plugins: mode === 'production' ? [visualizer({ brotliSize: true, open: true })] : [],
      },
      sourcemap: mode !== 'production',
      target: ['chrome134'],
    },
    define: {
      'process.env': {
        API_BASE_URL: process.env['API_BASE_URL'],
      },
    },
    plugins: [
      react(),
      viteCompression({
        algorithm: 'brotliCompress',
        threshold: 0,
      }),
    ],
  };
});
