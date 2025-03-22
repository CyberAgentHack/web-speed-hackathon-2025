import type { BetterFetchPlugin } from '@better-fetch/fetch';

export const schedulePlugin = {
  hooks: {
    onRequest: (request) => {
      // 遅延なしで即時実行
      return request;
    },
  },
  id: 'schedulePlugin',
  name: 'Schedule Plugin',
} satisfies BetterFetchPlugin;
