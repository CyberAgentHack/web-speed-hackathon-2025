import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useMuted() {
  const program = useStore((s) => s.pages.program);
  const muted = program.muted;
  const toggleMuted = () => {
    program.setMuted(!muted);
  };
  return [muted, toggleMuted] as const;
}
