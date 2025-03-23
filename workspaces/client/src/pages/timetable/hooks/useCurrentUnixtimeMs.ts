import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const currentUnixtimeMs = useStore((s) => s.pages.timetable.currentUnixtimeMs);
  const refreshCurrentUnixtimeMs = useStore((s) => s.pages.timetable.refreshCurrentUnixtimeMs);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshCurrentUnixtimeMs();
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [refreshCurrentUnixtimeMs]);

  return currentUnixtimeMs;
}
