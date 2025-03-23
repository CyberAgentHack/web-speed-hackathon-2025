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
            bi: () => fetch('https://cdn.jsdelivr.net/npm/@iconify-json/bi/icons.json')
              .then(response => response.json())
              .then(data => data as IconifyJSON),
            'fa-regular': () => fetch('https://cdn.jsdelivr.net/npm/@iconify-json/fa-regular/icons.json')
              .then(response => response.json())
              .then(data => data as IconifyJSON),
            'fa-solid': () => fetch('https://cdn.jsdelivr.net/npm/@iconify-json/fa-solid/icons.json')
              .then(response => response.json())
              .then(data => data as IconifyJSON),
            'line-md': () => fetch('https://cdn.jsdelivr.net/npm/@iconify-json/line-md/icons.json')
              .then(response => response.json())
              .then(data => data as IconifyJSON),
            'material-symbols': () => fetch('https://cdn.jsdelivr.net/npm/@iconify-json/material-symbols/icons.json')
                .then(response => response.json())
                .then(data => data as IconifyJSON),
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
