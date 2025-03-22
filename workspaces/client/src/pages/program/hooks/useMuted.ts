import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const programState = useStore((s) => s.pages.program);
  const muted = programState.muted;
  const toggleMuted = () => {
    programState.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
