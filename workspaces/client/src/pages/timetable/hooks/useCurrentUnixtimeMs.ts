import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const timetablePage = useStore((s) => s.pages.timetable);
  useEffect(() => {
    timetablePage.refreshCurrentUnixtimeMs();
    const interval = setInterval(() => {
      timetablePage.refreshCurrentUnixtimeMs();
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return timetablePage.currentUnixtimeMs;
}
