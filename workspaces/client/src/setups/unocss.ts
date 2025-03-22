import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

import biIcons from '../../assets/icons/bi.json';
import faSolidIcons from '../../assets/icons/fa-solid.json';
import fluentIcons from '../../assets/icons/fluent.json';
import lineMdIcons from '../../assets/icons/line-md.json';
import materialIcons from '../../assets/icons/material.json';

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
            // bi: () => import('@iconify/json/json/bi.json').then((m): IconifyJSON => m.default as IconifyJSON),
            bi: () => biIcons as IconifyJSON,
            // bx: () => import('@iconify/json/json/bx.json').then((m): IconifyJSON => m.default as IconifyJSON),
            // 'fa-regular': () =>
            //   import('@iconify/json/json/fa-regular.json').then((m): IconifyJSON => m.default as IconifyJSON),
            // 'fa-solid': () =>
            //   import('@iconify/json/json/fa-solid.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'fa-solid': () => faSolidIcons as IconifyJSON,
            // fluent: () => import('@iconify/json/json/fluent.json').then((m): IconifyJSON => m.default as IconifyJSON),
            fluent: () => fluentIcons as IconifyJSON,
            // 'line-md': () =>
            //   import('@iconify/json/json/line-md.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'line-md': () => lineMdIcons as IconifyJSON,
            'material-symbols': () => materialIcons as IconifyJSON,
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
