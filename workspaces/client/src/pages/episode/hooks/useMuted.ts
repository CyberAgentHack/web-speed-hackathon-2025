import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const episodePage = useStore((s) => s.pages.episode);
  const muted = episodePage.muted;
  const toggleMuted = () => {
    episodePage.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
