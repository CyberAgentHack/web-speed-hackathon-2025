import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const state = useStore((s) => s);

  useEffect(() => {
    let animationFrameId: number;

    function updateTime() {
      state.pages.timetable.refreshCurrentUnixtimeMs();
      animationFrameId = requestAnimationFrame(updateTime);
    }

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return state.pages.timetable.currentUnixtimeMs;
}
