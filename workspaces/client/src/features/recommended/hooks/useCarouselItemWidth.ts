import { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const [itemWidth, setItemWidth] = useState(MIN_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateWidth = () => {
      if (!containerRef.current) return;

      const styles = window.getComputedStyle(containerRef.current);
      const innerWidth = containerRef.current.clientWidth - 
        parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
      const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
      const newItemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);

      setItemWidth(newItemWidth);
    };

    // Calculate initial width
    calculateWidth();

    // Set up ResizeObserver to recalculate when container resizes
    const resizeObserver = new ResizeObserver(calculateWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { ref: containerRef, width: itemWidth };
}
