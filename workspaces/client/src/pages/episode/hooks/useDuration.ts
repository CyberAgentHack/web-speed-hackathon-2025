import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useDuration() {
  const episodeState = useStore((s) => s.pages.episode);
  return episodeState.duration;
}
