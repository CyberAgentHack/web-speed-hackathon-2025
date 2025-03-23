import presetIcons from '@unocss/preset-icons/browser';
import presetMini from '@unocss/preset-mini';
import initUnocssRuntime, { defineConfig } from '@unocss/runtime';
import type { Preset } from '@unocss/core';

// 必要なアイコンのみを含むカスタムコレクション
const customCollections = {
  'material-symbols': () => ({
    prefix: 'material-symbols',
    icons: {
      'play-arrow-rounded': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Z"/></svg>',
      },
      'pause-rounded': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5h3v14H8Zm5 0V5h3v14h-3Z"/></svg>',
      },
      'volume-off-rounded': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m3.15 3.85l4.2 4.2L7 8.4v7.2l5 5V12l4.2 4.2l2.8 2.8l1.4-1.4L4.55 2.45L3.15 3.85ZM19 12c0-1.3-.5-2.5-1.25-3.45L16.3 10c.45.6.7 1.3.7 2c0 .7-.25 1.4-.7 2l1.45 1.45c.75-.95 1.25-2.15 1.25-3.45Zm-2-8l-1.4 1.4l1.95 1.95c1.25 1.25 2.05 3 2.05 4.65c0 1.65-.75 3.15-2 4.4l1.45 1.45C20.95 16 22 13.65 22 11c0-2.65-1.05-5-2.75-6.75L17 2Zm-5-2v4.8l2 2V0L7 5v1.6l2 2V5l3-3Z"/></svg>',
      },
      'volume-up-rounded': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 15V9l5-5v16l-5-5Zm12-4c0-1.3-.5-2.5-1.25-3.45c-.75-.95-1.85-1.7-3.15-2.05v2.1c.8.3 1.45.75 1.9 1.4c.45.6.7 1.3.7 2c0 .7-.25 1.4-.7 2c-.45.6-1.1 1.1-1.9 1.4v2.1c1.3-.35 2.4-1.1 3.15-2.05C18.5 13.5 19 12.3 19 11Zm-3.6-9.95c1.95.65 3.6 1.85 4.8 3.45C21.4 6.1 22 8.45 22 11c0 2.55-.6 4.9-1.8 6.5c-1.2 1.6-2.85 2.8-4.8 3.45v-2.1c1.45-.5 2.65-1.35 3.55-2.55c.9-1.2 1.35-2.65 1.35-4.3c0-1.65-.45-3.1-1.35-4.3c-.9-1.2-2.1-2.05-3.55-2.55V1.05Z"/></svg>',
      },
      'error-outline': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 15h2v2h-2v-2Zm0-8h2v6h-2V7Zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8Z"/></svg>',
      },
      'warning-outline-rounded': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>',
      },
    },
  }),
  'line-md': () => ({
    prefix: 'line-md',
    icons: {
      'loading-twotone-loop': {
        body: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" stroke-opacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path stroke-dasharray="15" stroke-dashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>',
      },
    },
  }),
  'fa-solid': () => ({
    prefix: 'fa-solid',
    icons: {
      'sign-out-alt': {
        body: '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"/></svg>',
      },
      user: {
        body: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>',
      },
      calendar: {
        body: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"/></svg>',
      },
    },
  }),
  bi: () => ({
    prefix: 'bi',
    icons: {
      'house-fill': {
        body: '<path fill="currentColor" d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/><path fill="currentColor" d="m8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>',
      },
    },
  }),
  fluent: () => ({
    prefix: 'fluent',
    icons: {
      'live-24-filled': {
        body: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10zM8 8.5A1.5 1.5 0 0 1 9.5 7h5A1.5 1.5 0 0 1 16 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 15.5v-7z"/></svg>',
      },
    },
  }),
} as const;

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
          dialog::backdrop {
            background: rgba(0, 0, 0, 0.47);
          }
          dialog {
            padding: 0;
            border: none;
            background: transparent;
            max-width: 100vw;
            max-height: 100vh;
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
        presetMini() as Preset,
        presetIcons({
          collections: customCollections,
        }),
      ],
    }),
  });
}

init().catch((err: unknown) => {
  throw err;
});
