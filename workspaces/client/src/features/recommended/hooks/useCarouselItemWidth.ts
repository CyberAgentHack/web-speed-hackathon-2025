import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

export function useCarouselItemWidth() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [itemWidth, setItemWidth] = useState(MIN_WIDTH);
  
  const calculateWidth = useCallback(() => {
    if (!containerRef.current) return;
    
    const styles = window.getComputedStyle(containerRef.current);
    const innerWidth = containerRef.current.clientWidth - 
      parseInt(styles.paddingLeft) - 
      parseInt(styles.paddingRight);
    
    const itemCount = Math.max(1, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
    const newWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);
    
    if (newWidth !== itemWidth) {
      setItemWidth(newWidth);
    }
  }, [itemWidth]);

  useEffect(() => {
    calculateWidth();
    
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(calculateWidth);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.disconnect();
      }
    };
  }, [calculateWidth]);

  return { ref: containerRef, width: itemWidth };
}