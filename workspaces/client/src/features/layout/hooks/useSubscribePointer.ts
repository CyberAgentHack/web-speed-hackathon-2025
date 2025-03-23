import { useEffect, useRef } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const store = useStore((s) => s);
  const lastPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isPointerMoved = false;

    // ポインターの位置を記録する関数
    const handlePointerMove = (ev: MouseEvent) => {
      lastPosition.current.x = ev.clientX;
      lastPosition.current.y = ev.clientY;
      isPointerMoved = true;

      // まだrAFが予約されていない場合のみ新しく予約
      if (rafId.current == null) {
        scheduleUpdate();
      }
    };

    // requestAnimationFrameを使って状態更新をスケジュールする関数
    const scheduleUpdate = () => {
      rafId.current = requestAnimationFrame(() => {
        if (isPointerMoved) {
          store.features.layout.updatePointer({
            x: lastPosition.current.x,
            y: lastPosition.current.y,
          });
          isPointerMoved = false;
        }

        // 次のフレームの更新をスケジュール
        rafId.current = null;
        scheduleUpdate();
      });
    };

    // イベントリスナーを登録
    window.addEventListener('pointermove', handlePointerMove, {
      signal: abortController.signal,
      passive: true, // パフォーマンス向上のためpassiveを追加
    });

    // クリーンアップ関数
    return () => {
      abortController.abort();
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [store]);
}
