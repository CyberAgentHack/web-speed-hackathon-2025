import { createGenerator } from '@unocss/core';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import presetWind3 from '@unocss/preset-wind3';
import presetIcons from '@unocss/preset-icons/browser';
import { IconifyJSON } from '@iconify/types';

// CSS ファイルを直接読み込む関数
function readCssFile(relativePath: string): string {
  const filePath = path.resolve(process.cwd(), '../../', 'node_modules', '@unocss', 'reset', relativePath);
  return readFileSync(filePath, 'utf-8');
}

// tailwind-compat.css の内容を直接取得
const tailwindCompatCss = readCssFile('tailwind-compat.css');

export function createUnocssGenerator() {
  return createGenerator({
    layers: {
      default: 1,
      icons: 0,
      preflights: 0,
      reset: -1,
    },
    preflights: [
      {
        getCSS: () => tailwindCompatCss,
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
          bi: () => import('@iconify/json/json/bi.json').then((m): IconifyJSON => m.default as IconifyJSON),
          bx: () => import('@iconify/json/json/bx.json').then((m): IconifyJSON => m.default as IconifyJSON),
          'fa-regular': () =>
            import('@iconify/json/json/fa-regular.json').then((m): IconifyJSON => m.default as IconifyJSON),
          'fa-solid': () =>
            import('@iconify/json/json/fa-solid.json').then((m): IconifyJSON => m.default as IconifyJSON),
          fluent: () => import('@iconify/json/json/fluent.json').then((m): IconifyJSON => m.default as IconifyJSON),
          'line-md': () => import('@iconify/json/json/line-md.json').then((m): IconifyJSON => m.default as IconifyJSON),
          'material-symbols': () =>
            import('@iconify/json/json/material-symbols.json').then((m): IconifyJSON => m.default as IconifyJSON),
        },
      }),
    ],
  });
}
