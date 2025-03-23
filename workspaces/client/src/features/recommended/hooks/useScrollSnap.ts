import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapToNearest = () => {
    if (!containerRef.current) return;

    const childElements = Array.from(containerRef.current.children) as HTMLElement[];
    const scrollPositions = childElements.map((el) => el.offsetLeft);
    const currentScroll = containerRef.current.scrollLeft;
    const nearestIndex = scrollPositions.reduce((prev, curr, idx) =>
      Math.abs(curr - currentScroll) < Math.abs(scrollPositions[prev] - currentScroll)
        ? idx
        : prev,
      0
    );

    isSnapping.current = true;
    containerRef.current.scrollTo({
      behavior: 'smooth',
      left: scrollPositions[nearestIndex] - scrollPadding,
    });
    setTimeout(() => {
      isSnapping.current = false;
    }, 1000);
  };

  const handleScroll = () => {
    if (isSnapping.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(snapToNearest, 100);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return containerRef;
}
