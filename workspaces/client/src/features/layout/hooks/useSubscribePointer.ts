import { useEffect, useRef } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const s = useStore((s) => s);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const abortController = new AbortController();

    const handlePointerMove = (ev: MouseEvent) => {
      // 前回の位置と同じ場合は更新をスキップ
      if (lastPosition.current.x === ev.clientX && lastPosition.current.y === ev.clientY) {
        return;
      }
      
      // 位置を更新
      lastPosition.current = { x: ev.clientX, y: ev.clientY };
      s.features.layout.updatePointer(lastPosition.current);
    };

    window.addEventListener('pointermove', handlePointerMove, { 
      signal: abortController.signal,
      passive: true  // パフォーマンス最適化
    });

    return () => {
      abortController.abort();
    };
  }, []);
}
