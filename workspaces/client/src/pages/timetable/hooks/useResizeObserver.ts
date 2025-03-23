/**
 * SEE: https://zenn.dev/osushi02/scraps/6ec122ed44ad30
 */
import { useCallback, useRef, useSyncExternalStore } from "react";

export const useResizeObserver = <T extends HTMLElement>(onStoreChange: () => void
) => {
  const ref = useRef<T>(null);
  const subscribe = useCallback(() => {
    const observer = new ResizeObserver((entries) => {
     // 監視対象の要素がリサイズした際、useSyncExternalStoreフックから渡される、
     // 画面の再描画を行う関数を実行する。
      entries.forEach(() => {
        onStoreChange()
      });
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    }
  }, []);

  const height = useSyncExternalStore(
    subscribe,
    () => ref.current?.clientHeight || 0,
    () => 0
  );
  const width = useSyncExternalStore(
    subscribe,
    () => ref.current?.clientWidth || 0,
    () => 0
  );
  return { height, ref, width };
};
