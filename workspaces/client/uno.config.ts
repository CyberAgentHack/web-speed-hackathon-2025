import type { IconifyJSON } from '@iconify/types'
import {
  defineConfig,
  presetIcons,
  presetWind3,
} from 'unocss'

export default defineConfig({
  layers: {
    default: 1,
    icons: 0,
    preflights: 0,
    reset: -1,
  },
  preflights: [
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
        bi: () => import('@iconify/json/json/bi.json').then((m): IconifyJSON => m.default as IconifyJSON),
        bx: () => import('@iconify/json/json/bx.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'fa-regular': () =>
          import('@iconify/json/json/fa-regular.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'fa-solid': () =>
          import('@iconify/json/json/fa-solid.json').then((m): IconifyJSON => m.default as IconifyJSON),
        fluent: () => import('@iconify/json/json/fluent.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'line-md': () =>
          import('@iconify/json/json/line-md.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'material-symbols': () =>
          import('@iconify/json/json/material-symbols.json').then((m): IconifyJSON => m.default as IconifyJSON),
      },
    }),
  ],
  safelist: [
    // 動的生成されるクラス
    'opacity-75',
    'cursor-pointer',
    'bg-gradient-to-b',
    'from-[#171717]',
    'to-transparent',
    'to-[#171717]',
    // 共通の動的クラス
    'size-[48px]',
    'text-[#ffffff]',
    'bg-[#00000077]',
    'bg-[#000000CC]',
    'animate-[fade-in_0.5s_ease-in_0.5s_both]',
    // ボーダーと構造的なクラス
    'border-x-[1px]',
    'border-x-[#212121]',
    'border-[2px]',
    'border-solid',
    'border-[#FFFFFF1F]',
    // ポジショニングとグリッド関連
    'place-self-center',
    'place-self-stretch',
    // サイズ関連の動的クラス
    'w-[24px]',
    'w-[8px]',
    'w-[188px]',
    'w-[480px]',
    'w-full',
    'w-auto',
    'h-[20px]',
    'h-[72px]',
    'h-[80px]',
    'h-[100vh]',
    'h-[120px]',
    'h-auto',
    'h-full',
    'min-h-[100vh]',
    // パディングとマージン
    'px-[8px]',
    'px-[12px]',
    'px-[16px]',
    'px-[24px]',
    'py-[32px]',
    'py-[48px]',
    'p-[8px]',
    'p-[14px]',
    'mb-[16px]',
    'mb-[24px]',
    'mx-[-24px]',
    'pl-[24px]',
    'pr-[56px]',
    'pt-[80px]',
    // テキストサイズ
    'text-[14px]',
    'text-[16px]',
    'text-[22px]',
    // 変数を含む動的クラス（固定値バージョン）
    'bg-[#FCF6E5]',
    'bg-[#212121]',
    'text-[#212121]', 
    'text-[#ffffff]',
    'text-[#767676]',
    'text-[#999999]',
  ],
}) 