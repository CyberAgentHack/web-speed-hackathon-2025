import { useEffect, useState } from 'react';

export function useSubscribePointer(): { x: number; y: number } {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const abortController = new AbortController();

    const current = { x: 0, y: 0 };
    const handlePointerMove = (ev: MouseEvent) => {
      current.x = ev.clientX;
      current.y = ev.clientY;
    };
    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    let timeoutId = setTimeout(function tick() {
      setPointer({ ...current });
      timeoutId = setTimeout(tick);
    });
    abortController.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  return pointer;
}
