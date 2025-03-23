import { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(MIN_WIDTH);

  useEffect(() => {
    // 初期表示時はすぐに計算
    calculateWidth();

    // その後はリサイズイベントとより長い間隔での更新
    const resizeObserver = new ResizeObserver(() => {
      calculateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // バックアップとして低頻度のインターバル
    const interval = setInterval(function tick() {
      calculateWidth();
    }, 1000); // 1秒に変更

    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  const calculateWidth = () => {
    if (containerRef.current == null) {
      setItemWidth(MIN_WIDTH);
      return;
    }

    const styles = window.getComputedStyle(containerRef.current);
    const innerWidth = containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
    const itemCount = Math.max(1, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
    setItemWidth(Math.floor((innerWidth + GAP) / itemCount - GAP));
  };

  return { ref: containerRef, width: itemWidth };
}
