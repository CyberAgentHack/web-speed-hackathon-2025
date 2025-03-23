import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const programPage = useStore((s) => s.pages.program);
  const muted = programPage.muted;
  const toggleMuted = () => {
    programPage.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
