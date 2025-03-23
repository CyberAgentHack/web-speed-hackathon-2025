import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  build: {
    rollupOptions: {
      plugins: [
        mode === 'analyze' &&
          visualizer({
            filename: 'stats.html',
            gzipSize: true,
            open: true,
          }),
      ],
    },
  },

  define: {
    'process.env.API_BASE_URL': JSON.stringify('/api'),
    'process.env.NODE_ENV': JSON.stringify(''),
  },

  optimizeDeps: {
    exclude: ['video.js', '@videojs'],
  },

  plugins: [tsconfigPaths(), react(), UnoCSS()],

  publicDir: '../../public',
}));
