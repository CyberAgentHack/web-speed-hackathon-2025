// // import { IconifyJSON } from '@iconify/types';
// // import presetIcons from '@unocss/preset-icons/browser';
// import presetWind3 from '@unocss/preset-wind3';
// import initUnocssRuntime, { defineConfig } from '@unocss/runtime';

// export async function init() {
//   await initUnocssRuntime({
//     defaults: defineConfig({
//       layers: {
//         default: 1,
//       },
//       presets: [presetWind3()],
//     }),
//     // SSRで生成されたCSSとのハイドレーション対応
//     ready: () => {
//       // サーバー側で生成されたスタイルを保持する
//       const serverStyles = document.querySelector('#__unocss__default');
//       if (serverStyles) {
//         // サーバー側のスタイルを保持するようマーク
//         serverStyles.setAttribute('data-unocss-hydration', 'true');
//       }
//     },
//   });
// }
