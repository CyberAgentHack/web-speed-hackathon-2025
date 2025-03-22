import { IconifyJSON } from '@iconify/types';
import presetIcons from '@unocss/preset-icons/browser';
import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

// 実際に使用するアイコンのみをロードする
const loadIconOnDemand = (name: string, iconName: string) => {
  if (typeof window === 'undefined') return;
  const iconModule = `@iconify/json/icons/${name}/${iconName}.json`;
  return import(/* webpackIgnore: true */ iconModule).then(
    (m): IconifyJSON => m.default as IconifyJSON
  ).catch(() => {
    console.warn(`Icon ${name}:${iconName} could not be loaded`);
    return { icons: {}, width: 16, height: 16 } as IconifyJSON;
  });
};

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
          // 必要なアイコンだけを動的にロードするカスタムリゾルバー
          customizations: {
            iconCustomizer(collection, icon, props) {
              props.width = '1.2em';
              props.height = '1.2em';
              return props;
            },
          },
          // 遅延ロード方式
          collections: {
            // 必要な時だけ個別のアイコンをロード
            custom: async (iconName) => {
              // アイコン名をコレクションと名前に分割
              // 例: "bi:alarm" => { collection: "bi", name: "alarm" }
              const [collection, name] = iconName.split(':');
              if (!collection || !name) {
                return { icons: {}, width: 16, height: 16 } as IconifyJSON;
              }
              return loadIconOnDemand(collection, name);
            },
          },
          scale: 1.2,
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
