import { useCallback } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const currentTime = useStore((s) => s.pages.episode.currentTime);
  const updateCurrentTime = useStore((s) => s.pages.episode.updateCurrentTime);

  const update = useCallback((second: number): void => {
    updateCurrentTime(second);
  }, [updateCurrentTime]);

  return [currentTime, update] as const;
}
