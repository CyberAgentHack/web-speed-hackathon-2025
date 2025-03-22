import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetWind3 from '@unocss/preset-wind3';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsDir: 'public',
    minify: false,
    outDir: 'dist',
  },
  plugins: [
    UnoCSS({
      presets: [
        presetWind3(),
        presetAttributify(),
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
        }),
      ],
      shortcuts: [{ logo: 'i-logos-react w-6em h-6em transform transition-800 hover:rotate-180' }],
    }),
    react(),
  ],
});
