import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  const state = useStore((s) => s);
  return state.pages.program.playerRef;
}
