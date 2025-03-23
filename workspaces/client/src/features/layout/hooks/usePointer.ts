import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePointer(): { x: number; y: number } {
  const s = useStore((s) => s);
  return s.features.layout.pointer;
}
