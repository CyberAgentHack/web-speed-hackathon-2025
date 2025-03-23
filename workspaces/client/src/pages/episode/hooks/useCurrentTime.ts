import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const episode = useStore((s) => s.pages.episode);
  const update = (second: number): void => {
    episode.updateCurrentTime(second);
  };
  return [episode.currentTime, update] as const;
}
