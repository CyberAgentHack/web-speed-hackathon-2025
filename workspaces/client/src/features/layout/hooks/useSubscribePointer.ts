import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const s = useStore((s) => s);

  useEffect(() => {
    const handlePointerMove = (ev: PointerEvent) => {
      s.features.layout.updatePointer({
        x: ev.clientX,
        y: ev.clientY,
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);
}
