import { resolve } from 'node:path';

import unocss from '@unocss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/public/',

  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.tsx'),
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
      external: ['shaka-player'],
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-use'],
  },

  resolve: {
    alias: {
      '@wsh-2025/client': resolve(__dirname, '.'),
      'shaka-player': resolve(__dirname, 'src/features/player/utils/shaka-stub.ts'),
      '@ffmpeg/core$': resolve(__dirname, 'node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': resolve(__dirname, 'node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm'),
    },
    mainFields: ['main', 'module', 'browser'],
  },

  plugins: [
    react(),
    unocss({
      mode: 'global',
    }),
  ],

  assetsInclude: ['**/*.wasm'],
});
