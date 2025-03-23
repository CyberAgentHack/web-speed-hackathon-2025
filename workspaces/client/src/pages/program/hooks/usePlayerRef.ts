import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  const state = useStore((s) => s.pages.program.playerRef);
  return state;
}
