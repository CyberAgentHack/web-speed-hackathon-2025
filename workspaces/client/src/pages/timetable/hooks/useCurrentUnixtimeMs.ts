import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const currentUnixTimeMsState = useStore((s) => s.pages.timetable.currentUnixTimeMs);

  useEffect(() => {
    const interval = setInterval(() => {
      currentUnixTimeMsState.refreshCurrentUnixTimeMs();
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return currentUnixTimeMsState.currentUnixTimeMs;
}
