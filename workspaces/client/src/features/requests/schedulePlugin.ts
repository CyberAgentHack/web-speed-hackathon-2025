import type { BetterFetchPlugin } from '@better-fetch/fetch';

export const schedulePlugin = {
  hooks: {
    onRequest: async (request) => {
      const scheduler = typeof window !== 'undefined' ? window.scheduler : undefined;

      if (scheduler) {
        return await scheduler.postTask(() => request);
      } else {
        return await new Promise<typeof request>((resolve) => {
          queueMicrotask(() => {
            resolve(request);
          });
        });
      }
    },
  },
  id: 'schedulePlugin',
  name: 'Schedule Plugin',
} satisfies BetterFetchPlugin;
