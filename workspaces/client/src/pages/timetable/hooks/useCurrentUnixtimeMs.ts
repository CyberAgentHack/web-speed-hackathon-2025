import { useCallback, useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  // セレクタを最適化: 必要な状態のみを選択
  const refreshCurrentUnixtimeMs = useStore(
    useCallback((s) => s.pages.timetable.refreshCurrentUnixtimeMs, [])
  );
  const currentUnixtimeMs = useStore(
    useCallback((s) => s.pages.timetable.currentUnixtimeMs, [])
  );

  useEffect(() => {
    // 更新間隔を250msから1000msに延長
    const interval = setInterval(() => {
      refreshCurrentUnixtimeMs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [refreshCurrentUnixtimeMs]);

  return currentUnixtimeMs;
}
