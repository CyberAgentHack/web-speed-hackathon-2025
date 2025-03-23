import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const episode = useStore((s) => s.pages.episode);
  const muted = episode.muted;
  const toggleMuted = () => {
    episode.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
