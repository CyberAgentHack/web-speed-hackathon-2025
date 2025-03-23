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
            bi: async () => {
              // CDNからJSONを取得
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/bi.json');
              return await response.json() as IconifyJSON;
            },
            bx: async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/bx.json');
              return await response.json() as IconifyJSON;
            },
            'fa-regular': async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/fa-regular.json');
              return await response.json() as IconifyJSON;
            },
            'fa-solid': async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/fa-solid.json');
              return await response.json() as IconifyJSON;
            },
            fluent: async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/fluent.json');
              return await response.json() as IconifyJSON;
            },
            'line-md': async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/line-md.json');
              return await response.json() as IconifyJSON;
            },
            'material-symbols': async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@iconify/json@2.2.319/json/material-symbols.json');
              return await response.json() as IconifyJSON;
            },
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
