import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

/**
 * レスポンシブなカルーセルのアイテム幅を計算するフック。
 * ポイント:
 *  - 250msごとのポーリングではなく、ResizeObserver で監視
 *  - containerRef の大きさが変わったタイミングでだけ再計算
 */
export function useCarouselItemWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState<number>(MIN_WIDTH);

  // 計算ロジックを関数化
  const recalcWidth = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const styles = window.getComputedStyle(el);
    const innerWidth = el.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);

    // 276px + GAP=12px で何個並べられるか
    const itemCount = Math.max(1, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
    const w = Math.floor((innerWidth + GAP) / itemCount - GAP);

    setItemWidth(w);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // ResizeObserver が使えるかどうかで分岐 (IEサポートなど)
    // ここでは対応環境を仮定して実装
    const observer = new ResizeObserver(() => {
      recalcWidth();
    });
    observer.observe(containerRef.current);

    // 初回計算
    recalcWidth();

    return () => {
      observer.disconnect();
    };
  }, [recalcWidth]);

  return { ref: containerRef, width: itemWidth };
}
