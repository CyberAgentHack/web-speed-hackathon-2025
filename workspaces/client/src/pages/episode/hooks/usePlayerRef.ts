import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  const episodePage = useStore((s) => s.pages.episode);
  return episodePage.playerRef;
}
