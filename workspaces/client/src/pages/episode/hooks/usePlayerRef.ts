import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  return useStore((s) => s.pages.episode.playerRef);
}
