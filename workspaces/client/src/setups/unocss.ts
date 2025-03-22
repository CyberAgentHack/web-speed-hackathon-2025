import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

// 実際に使用しているアイコンのリスト
const usedIcons = [
  // 例: 実際に使用しているアイコンのみをリスト
  'fluent:play-24-regular',
  'fluent:pause-24-regular',
  'material-symbols:volume-up',
  'material-symbols:volume-off',
  'material-symbols:fullscreen',
  'material-symbols:fullscreen-exit',
  'material-symbols:chevron-left',
  'material-symbols:chevron-right',
  // 他の使用中のアイコンをここに追加
];

// アイコンのコレクション名とアイコン名に分割する関数
function splitIconName(name: string): [string, string] {
  const [collection, iconName] = name.split(':');
  return [collection, iconName];
}

// 使用しているコレクションのみを取得
const usedCollections = [...new Set(usedIcons.map(icon => splitIconName(icon)[0]))];

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
          // 個別のアイコンのみをロード
          collections: {
            // 使用しているコレクションのみ条件付きで含める
            ...(usedCollections.includes('bi') && {
              bi: async () => {
                const icons = await import('@iconify/json/icons/bi.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('bx') && {
              bx: async () => {
                const icons = await import('@iconify/json/icons/bx.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('fa-regular') && {
              'fa-regular': async () => {
                const icons = await import('@iconify/json/icons/fa-regular.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('fa-solid') && {
              'fa-solid': async () => {
                const icons = await import('@iconify/json/icons/fa-solid.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('fluent') && {
              fluent: async () => {
                const icons = await import('@iconify/json/icons/fluent.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('line-md') && {
              'line-md': async () => {
                const icons = await import('@iconify/json/icons/line-md.json');
                return icons.default as IconifyJSON;
              }
            }),
            ...(usedCollections.includes('material-symbols') && {
              'material-symbols': async () => {
                const icons = await import('@iconify/json/icons/material-symbols.json');
                return icons.default as IconifyJSON;
              }
            }),
          },
          // 使用するアイコンだけを含める
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          },
          // 使用しているアイコンのみをインクルード
          include: usedIcons.map(icon => new RegExp(`^${icon.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`)),
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
