
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  base: '/public/',
  build: {
    minify: 'terser',
    outDir: 'dist',
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'main.js',
      },
    },
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        unused: true,
      },
      format: {
        comments: false,
      },
      keep_classnames: false,
      keep_fnames: false,
    },
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    react(),
  ],
});