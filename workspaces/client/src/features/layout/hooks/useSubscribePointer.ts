import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const layout = useStore((s) => s.features.layout);

  useEffect(() => {
    const abortController = new AbortController();

    const current = { x: 0, y: 0 };
    const handlePointerMove = (ev: MouseEvent) => {
      current.x = ev.clientX;
      current.y = ev.clientY;
      layout.updatePointer({ ...current });
    };

    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    abortController.signal.addEventListener('abort', () => {
      window.removeEventListener('pointermove', handlePointerMove);
    });

    return () => {
      abortController.abort();
    };
  }, []);
}
