import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const episodeState = useStore((s) => s.pages.episode);
  const update = (second: number): void => {
    episodeState.updateCurrentTime(second);
  };
  return [episodeState.currentTime, update] as const;
}
