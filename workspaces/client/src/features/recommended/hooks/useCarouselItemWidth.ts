import { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

export function useCarouselItemWidth() {
  const [width, setWidth] = useState(MIN_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateItemWidth = () => {
      if (containerRef.current == null) return;

      const styles = window.getComputedStyle(containerRef.current);
      const innerWidth =
        containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);

      const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
      const itemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);

      setWidth(itemWidth);
    };

    calculateItemWidth();

    window.addEventListener('resize', calculateItemWidth);

    return () => {
      window.removeEventListener('resize', calculateItemWidth);
    };
  }, []);

  return { ref: containerRef, width };
}
