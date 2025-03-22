import resetCSS from '@unocss/reset/tailwind-compat.css?raw';
import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

// 使用頻度の高いアイコンセットのみを事前に読み込み
// その他のアイコンセットは必要に応じて遅延ロード
const commonIcons = ['material-symbols', 'bi'];

async function loadIconCollection(collection: string): Promise<IconifyJSON> {
  const module = await import(`@iconify/json/json/${collection}.json`);
  return module.default as IconifyJSON;
}

async function init() {
  // 使用頻度の高いアイコンを事前読み込み
  const preloadedIcons: Record<string, IconifyJSON> = {};
  
  // 並列で読み込み処理を実行
  await Promise.all(
    commonIcons.map(async (collection) => {
      preloadedIcons[collection] = await loadIconCollection(collection);
    })
  );

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
          getCSS: () => resetCSS, // リセットCSSをインライン化
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
            // 事前に読み込んだアイコン
            ...preloadedIcons,
            // 残りは遅延ロード
            bx: () => loadIconCollection('bx'),
            'fa-regular': () => loadIconCollection('fa-regular'),
            'fa-solid': () => loadIconCollection('fa-solid'),
            fluent: () => loadIconCollection('fluent'),
            'line-md': () => loadIconCollection('line-md'),
          },
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
