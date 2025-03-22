import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

import biIcons from '@wsh-2025/client/src/setups/icons/bi.json';
import faSolidIcons from '@wsh-2025/client/src/setups/icons/fa-solid.json';
import fluentIcons from '@wsh-2025/client/src/setups/icons/fluent.json';
import lineMdIcons from '@wsh-2025/client/src/setups/icons/line-md.json';
import materialSymbolsIcons from '@wsh-2025/client/src/setups/icons/material-symbols.json';

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
            bi: () => Promise.resolve(biIcons as IconifyJSON),
            // bx: () => import('@iconify/json/json/bx.json').then((m): IconifyJSON => m.default as IconifyJSON),
            // 'fa-regular': () =>
            //   import('@iconify/json/json/fa-regular.json').then((m): IconifyJSON => m.default as IconifyJSON),
            'fa-solid': () => Promise.resolve(faSolidIcons as IconifyJSON),
            fluent: () => Promise.resolve(fluentIcons as IconifyJSON),
            'line-md': () => Promise.resolve(lineMdIcons as IconifyJSON),
            'material-symbols': () => Promise.resolve(materialSymbolsIcons as IconifyJSON),
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});