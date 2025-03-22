import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  const state = useStore((s) => s.pages.timetable);
  useEffect(() => {
    state.refreshCurrentUnixtimeMs();
  }, []);
  return state.currentUnixtimeMs;
}
