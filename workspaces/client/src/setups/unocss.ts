import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

async function init() {
  await initUnocssRuntime({
    defaults: defineConfig({
      layers: {
        default: 1,
        icons: 0,
        preflights: 0,
        reset: -1,
      },
      preflights: [
        {
          getCSS: () => import('@unocss/reset/tailwind-compat.css?raw').then(({ default: css }) => css),
          layer: 'reset',
        },
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
            bi: () => import('../../assets/icons/bi.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'fa-solid': () =>
              import('../../assets/icons/fa-solid.json').then((m): IconifyJSON => m.default as IconifyJSON),
            fluent: () => import('../../assets/icons/fluent.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'line-md': () =>
              import('../../assets/icons/line-md.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'material-symbols': () =>
              import('../../assets/icons/material-symbols.json').then((m): IconifyJSON => m.default as IconifyJSON),
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
