import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const state = useStore((s) => s);
  const muted = state.pages.episode.muted;
  const toggleMuted = () => {
    state.pages.episode.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
