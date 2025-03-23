import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const updatePointer = useStore((s) => s.features.layout.updatePointer);

  useEffect(() => {
    console.log('useSubscribePointer useEffect');
    const abortController = new AbortController();

    const current = { x: 0, y: 0 };
    const handlePointerMove = (ev: MouseEvent) => {
      current.x = ev.clientX;
      current.y = ev.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    let immediate = setImmediate(function tick() {
      updatePointer({ ...current });
      immediate = setImmediate(tick);
    });
    abortController.signal.addEventListener('abort', () => {
      clearImmediate(immediate);
    });

    return () => {
      abortController.abort();
    };
  }, []);
}
