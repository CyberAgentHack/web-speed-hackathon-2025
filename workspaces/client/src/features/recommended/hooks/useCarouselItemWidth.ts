import { useEffect, useRef } from 'react';
import { useUpdate } from 'react-use';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const forceUpdate = useUpdate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(function tick() {
      forceUpdate();
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (containerRef.current == null) {
    return { ref: containerRef, width: MIN_WIDTH };
  }

  const styles = window.getComputedStyle(containerRef.current);
  const innerWidth = containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
  const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
  const itemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);

  return { ref: containerRef, width: itemWidth };
}
