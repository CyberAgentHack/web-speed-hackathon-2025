import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlayerRef() {
  const programState = useStore((s) => s.pages.program);
  return programState.playerRef;
}
