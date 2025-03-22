import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const s = useStore((s) => s);

  useEffect(() => {
    const abortController = new AbortController();

    const handlePointerMove = (ev: MouseEvent) => {
      s.features.layout.updatePointer({
        x: ev.clientX,
        y: ev.clientY,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, []);
}
