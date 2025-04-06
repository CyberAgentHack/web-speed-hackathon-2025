import presetWind3 from '@unocss/preset-wind3';
import { defineConfig } from 'unocss';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  presets: [presetWind3()],
});
