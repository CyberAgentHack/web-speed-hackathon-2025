import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const s = useStore((s) => s);

  useEffect(() => {
    const abortController = new AbortController();

    const current = { x: 0, y: 0 };
    const handlePointerMove = (ev: MouseEvent) => {
      current.x = ev.clientX;
      current.y = ev.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    let frameId:number;
    function tick() {
      s.features.layout.updatePointer({ ...current });
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    abortController.signal.addEventListener('abort', () => {
      cancelAnimationFrame(frameId);
    });

    return () => {
      abortController.abort();
    };
  }, []);
}
