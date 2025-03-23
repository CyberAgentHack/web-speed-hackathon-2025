import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useSubscribePointer } from '@wsh-2025/client/src/features/layout/hooks/useSubscribePointer';

export function usePointer(): { x: number; y: number } {
  useSubscribePointer();
  const pointer = useStore((s) => s.features.layout.pointer);
  return pointer;
}
