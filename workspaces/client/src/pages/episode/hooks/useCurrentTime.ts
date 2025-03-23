import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const state = useStore((s) => s);
  const update = (second: number): void => {
    state.pages.episode.updateCurrentTime(second);
  };
  return [state.pages.episode.currentTime, update] as const;
}
