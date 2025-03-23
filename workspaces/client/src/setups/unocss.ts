import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

// よく使われるアイコンコレクション
const CRITICAL_ICON_COLLECTIONS = [
  'line-md',
  'material-symbols'
];

// その他のアイコンコレクション （必要に応じて遅延読み込み）
const LAZY_ICON_COLLECTIONS = [
  'bi',
  'bx',
  'fa-regular',
  'fa-solid',
  'fluent'
];

async function init() {
  // クリティカルなアイコンコレクションを先読み
  const criticalCollections: Record<string, () => Promise<IconifyJSON>> = {};
  for (const collection of CRITICAL_ICON_COLLECTIONS) {
    criticalCollections[collection] = () =>
      import(`@iconify/json/json/${collection}.json`).then((m): IconifyJSON => m.default as IconifyJSON);
  }

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
            ...criticalCollections,
            // 遅延読み込みするアイコンコレクション
            ...LAZY_ICON_COLLECTIONS.reduce((acc, collection) => {
              acc[collection] = () =>
                import(`@iconify/json/json/${collection}.json`).then((m): IconifyJSON => m.default as IconifyJSON);
              return acc;
            }, {} as Record<string, () => Promise<IconifyJSON>>)
          },
          // アイコンを最適化
          scale: 1,
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          },
        }),
      ],
    }),
  });
}

// エラーハンドリングを強化
init().catch((err: unknown) => {
  console.error('Failed to initialize UnoCSS:', err);
});
