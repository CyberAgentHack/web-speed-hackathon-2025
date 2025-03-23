import presetWind3 from '@unocss/preset-wind3';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

const fontFaceDefinition = `
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/noto-sans-jp/noto-sans-jp-regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD, U+3000-303F, U+3040-309F, U+30A0-30FF, U+FF00-FFEF, U+4E00-9FAF;
}
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/noto-sans-jp/noto-sans-jp-medium.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD, U+3000-303F, U+3040-309F, U+30A0-30FF, U+FF00-FFEF, U+4E00-9FAF;
}
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/noto-sans-jp/noto-sans-jp-bold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD, U+3000-303F, U+3040-309F, U+30A0-30FF, U+FF00-FFEF, U+4E00-9FAF;
}`;

async function init() {
  // プリセットアイコンを動的にインポート
  const { default: presetIcons } = await import('@unocss/preset-icons/browser');

  // アイコンをプリロードしてパフォーマンスを向上させる
  const icons = {
    // ナビゲーションとレイアウトで使用されるアイコン
    'bi:house-fill': (await import('@iconify-icons/bi/house-fill')).default,
    'fa-solid:calendar': (await import('@iconify-icons/fa-solid/calendar')).default,
    'fa-solid:user': (await import('@iconify-icons/fa-solid/user')).default,
    'fa-solid:sign-out-alt': (await import('@iconify-icons/fa-solid/sign-out-alt')).default,

    // 他のアイコン
    'bi:check': (await import('@iconify-icons/bi/check')).default,
    'fa-solid:play': (await import('@iconify-icons/fa-solid/play')).default,
    'fluent:settings-16-filled': (await import('@iconify-icons/fluent/settings-16-filled')).default,
    'line-md:loading-twotone-loop': (await import('@iconify-icons/line-md/loading-twotone-loop')).default,
    'material-symbols:volume-up-rounded': (await import('@iconify-icons/material-symbols/volume-up-rounded')).default,
    'material-symbols:volume-off-rounded': (await import('@iconify-icons/material-symbols/volume-off-rounded')).default,
    'material-symbols:pause-rounded': (await import('@iconify-icons/material-symbols/pause-rounded')).default,
    'material-symbols:play-arrow-rounded': (await import('@iconify-icons/material-symbols/play-arrow-rounded')).default,
  };

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
        // フォントフェース定義を明示的に追加
        {
          getCSS: () => fontFaceDefinition,
        },
      ],
      presets: [
        presetWind3(),
        presetIcons({
          // アイコンのカスタマイズを明確に定義
          collections: {
            bi: () => Promise.resolve({}),
            'fa-solid': () => Promise.resolve({}),
          },
          scale: 1.2,
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
          // 事前にロードしたアイコンを使用するカスタマイズを追加
          customizations: {
            async load(collection, icon) {
              const key = `${collection}:${icon}`;
              return icons[key] || null;
            },
          },
        }),
      ],
      // フォントファミリーの設定を追加
      theme: {
        fontFamily: {
          sans: ['"Noto Sans JP"', 'sans-serif'],
        },
      },
    }),
  });
}

// エラーをキャッチして処理を続行できるようにする
init().catch((err: unknown) => {
  console.error('UnoCSS initialization failed:', err);
});
