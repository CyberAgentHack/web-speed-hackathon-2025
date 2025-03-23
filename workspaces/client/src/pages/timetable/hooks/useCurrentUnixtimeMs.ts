import { useEffect } from 'react';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentUnixtimeMs(): number {
  // zustandセレクタを適切に設定
  const { currentUnixtimeMs, refreshCurrentUnixtimeMs } = useStore((s) => ({
    currentUnixtimeMs: s.pages.timetable.currentUnixtimeMs,
    refreshCurrentUnixtimeMs: s.pages.timetable.refreshCurrentUnixtimeMs,
  }));

  useEffect(() => {
    // 1秒に変更 (必要に応じて可変)
    const interval = setInterval(() => {
      refreshCurrentUnixtimeMs();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [refreshCurrentUnixtimeMs]);

  return currentUnixtimeMs;
}
