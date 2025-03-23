import type { IconifyJSON } from '@iconify/types';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

async function init() {
  // プリセットアイコンを動的にインポート
  const { default: presetIcons } = await import('@unocss/preset-icons/browser');

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
            // 実際に使用されているアイコンのみをインポート
            bi: async () => {
              return import('@iconify/json/json/bi.json').then((m) => m.default as IconifyJSON);
            },
            'fa-solid': async () => {
              return import('@iconify/json/json/fa-solid.json').then((m) => m.default as IconifyJSON);
            },
            fluent: async () => {
              return import('@iconify/json/json/fluent.json').then((m) => m.default as IconifyJSON);
            },
            'line-md': async () => {
              return import('@iconify/json/json/line-md.json').then((m) => m.default as IconifyJSON);
            },
            'material-symbols': async () => {
              return import('@iconify/json/json/material-symbols.json').then((m) => m.default as IconifyJSON);
            },
          },
        }),
      ],
    }),
  });
}

// エラーをキャッチして処理を続行できるようにする
init().catch((err: unknown) => {
  console.error('UnoCSS initialization failed:', err);
});
