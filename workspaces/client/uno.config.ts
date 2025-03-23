import { defineConfig, presetIcons, presetWind } from 'unocss';

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      // アイコンコレクションを明示的に指定
      collections: {
        bi: () => import('@iconify-icons/bi'),
        'fa-solid': () => import('@iconify-icons/fa-solid'),
        fluent: () => import('@iconify-icons/fluent'),
        'line-md': () => import('@iconify-icons/line-md'),
        'material-symbols': () => import('@iconify-icons/material-symbols'),
      },
    }),
  ],
  // アイコン用のショートカットを追加
  shortcuts: {
    icon: 'inline-block align-middle',
  },
});
