import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [
    UnoCSS(),
    react()
  ],
  base: '/public/',
  build: {
    minify: 'terser',
    outDir: 'dist',
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
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'main.js',
        assetFileNames: 'assets/[name].[ext]',
      },
      plugins: [
        visualizer({ filename: 'stats.html' }),
      ],
    },
    sourcemap: false,
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
