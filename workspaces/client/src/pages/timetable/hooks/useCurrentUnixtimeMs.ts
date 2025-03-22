import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const timetableState = useStore((s) => s.pages.timetable);
  useEffect(() => {
    const interval = setInterval(() => {
      timetableState.refreshCurrentUnixtimeMs();
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return timetableState.currentUnixtimeMs;
}
