import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { debounce } from '@wsh-2025/client/src/utils/debounce';

export function useSubscribePointer(): void {
  const updatePointer = useStore((s) => s.features.layout.updatePointer);

  useEffect(() => {
    const abortController = new AbortController();

    // 位置が変わったときだけ更新するように最適化
    const handlePointerMove = debounce((ev: MouseEvent) => {
      updatePointer({ x: ev.clientX, y: ev.clientY });
    }, 16); // 約60FPSに制限

    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [updatePointer]);
}
