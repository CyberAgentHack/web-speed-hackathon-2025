import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  const episodeState = useStore((s) => s.pages.episode);
  return episodeState.playerRef;
}
