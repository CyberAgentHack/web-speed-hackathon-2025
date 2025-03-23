import { IconifyJSON } from '@iconify/types';
import { defineConfig, presetIcons, presetWind3 } from 'unocss';

import customIcons from './src/setups/icons.json';

export default defineConfig({
  layers: {
    default: 1,
    icons: 0,
    preflights: 0,
    reset: -1,
  },
  preflights: [
    {
      getCSS: () => /* css */ `
        @view-transition {
          navigation: auto;
        }
        html,
        :host {
          font-family: 'Noto Sans JP', sans-serif !important;
        }
        video {
          max-height: 100%;
          max-width: 100%;
        }
      `,
    },
    {
      getCSS: () => /* css */ `
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `,
    },
  ],
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        custom: () => Promise.resolve(customIcons as IconifyJSON),
      },
    }),
  ],
  safelist: [
    'i-custom-loading-twotone-loop',
    'i-custom-error-outline',
    'i-custom-play-arrow-rounded',
    'i-custom-warning-outline-rounded',
    'i-custom-volume-off-rounded',
    'i-custom-volume-up-rounded',
    'i-custom-sign-out-alt',
    'i-custom-user',
    'i-custom-house-fill',
    'i-custom-calendar',
    'i-custom-live-24-filled',
  ],
});
