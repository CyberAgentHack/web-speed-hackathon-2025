import { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(MIN_WIDTH);

  function updateWidth() {
    if (containerRef.current == null) {
      setItemWidth(MIN_WIDTH);
      return;
    }

    const styles = window.getComputedStyle(containerRef.current);
    const innerWidth = containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
    const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
    const newWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);
    
    // 前回と同じ幅の場合は更新をスキップ
    if (newWidth !== itemWidth) {
      setItemWidth(newWidth);
    }
  }

  useEffect(() => {
    // ResizeObserverを使用してコンテナのサイズ変更を監視
    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 初回実行
    updateWidth();

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref: containerRef, width: itemWidth };
}
