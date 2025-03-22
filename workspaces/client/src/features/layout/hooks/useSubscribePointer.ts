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

    let animationFrameID: number;
    const handleAnimationFrame = () => {
      s.features.layout.updatePointer({ ...current });
      animationFrameID = requestAnimationFrame(handleAnimationFrame);
    };

    animationFrameID = requestAnimationFrame(handleAnimationFrame);

    abortController.signal.addEventListener('abort', () => {
      cancelAnimationFrame(animationFrameID);
    });

    return () => {
      abortController.abort();
    };
  }, []);
}
