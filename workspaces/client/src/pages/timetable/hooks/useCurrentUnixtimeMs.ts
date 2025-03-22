import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const state = useStore((s) => s);

  useEffect(() => {
    let rafId: number | null = null;

    const updateCurrentTime = () => {
      state.pages.timetable.refreshCurrentUnixtimeMs();

      rafId = requestAnimationFrame(updateCurrentTime);
    };

    rafId = requestAnimationFrame(updateCurrentTime);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return state.pages.timetable.currentUnixtimeMs;
}
