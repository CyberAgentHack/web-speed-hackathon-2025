import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const episodeState = useStore((s) => s.pages.episode);
  const muted = episodeState.muted;
  const toggleMuted = () => {
    episodeState.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
