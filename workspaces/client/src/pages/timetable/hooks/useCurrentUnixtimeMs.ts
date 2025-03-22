import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const state = useStore((s) => s);
  useEffect(() => {
    const interval = setInterval(() => {
      state.pages.timetable.refreshCurrentUnixtimeMs();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return state.pages.timetable.currentUnixtimeMs;
}
