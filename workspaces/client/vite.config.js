import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
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
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      plugins: [
        visualizer({ filename: 'stats.html' }),
      ],
    },
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@ffmpeg/core$': './node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js',
      '@ffmpeg/core/wasm$': './node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm?url',
    },
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
