import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const state = useStore((s) => s.pages.program);
  const muted = state.muted;
  const toggleMuted = () => {
    state.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
