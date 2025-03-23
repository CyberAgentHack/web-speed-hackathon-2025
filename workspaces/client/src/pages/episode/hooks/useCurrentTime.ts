import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const state = useStore((s) => s.pages.episode);
  const update = (second: number): void => {
    state.updateCurrentTime(second);
  };
  return [state.currentTime, update] as const;
}
