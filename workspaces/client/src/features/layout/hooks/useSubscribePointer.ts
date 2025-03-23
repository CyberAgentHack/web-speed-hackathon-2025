// import { useEffect } from 'react';

// import { useStore } from '@wsh-2025/client/src/app/StoreContext';

// export function useSubscribePointer(): void {
//   const s = useStore((s) => s);

//   useEffect(() => {
//     const abortController = new AbortController();

//     const current = { x: 0, y: 0 };
//     const handlePointerMove = (ev: MouseEvent) => {
//       current.x = ev.clientX;
//       current.y = ev.clientY;
//     };
//     window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

//     let immediate = setImmediate(function tick() {
//       s.features.layout.updatePointer({ ...current });
//       immediate = setImmediate(tick);
//     });
//     abortController.signal.addEventListener('abort', () => {
//       clearImmediate(immediate);
//     });

//     return () => {
//       abortController.abort();
//     };
//   }, []);
// }

import { useEffect } from 'react';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const s = useStore((s) => s);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handlePointerMove = (ev: MouseEvent) => {
      // 毎回最新の座標を記憶
      lastX = ev.clientX;
      lastY = ev.clientY;

      // すでにセットされているタイマーがあればクリア
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 一定時間（例：200ms）後に1度だけ処理を実行
      // それ以内にまたマウスが動いたら再度リセットされる
      timeoutId = setTimeout(() => {
        s.features.layout.updatePointer({ x: lastX, y: lastY });
        timeoutId = null;
      }, 200);
    };

    // pointermove イベント登録
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [s]);
}
