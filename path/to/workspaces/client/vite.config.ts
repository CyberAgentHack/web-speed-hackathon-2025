import react from '@vitejs/plugin-react';
import unocss from '@unocss/vite';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        chunkFileNames: 'chunk-[contenthash].js',
        entryFileNames: 'main.js',
      },
    },
  },
  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify(''),
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  plugins: [react(), unocss()],
  resolve: {
    alias: {
      '@ffmpeg/core$': path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
      '@ffmpeg/core/wasm$': path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
