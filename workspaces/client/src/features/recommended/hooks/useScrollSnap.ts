import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const isSnapping = useRef(false);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const handleScroll = () => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;
    };

    const handleScrollend = () => {
      if (!isScrolling.current) {
        return;
      }
      isScrolling.current = false;
    };

    let timer: ReturnType<typeof setTimeout> | null = null;
    let interval = setInterval(() => {
      if (!containerRef.current) {
        return;
      }

      const childElements = Array.from(containerRef.current.children) as HTMLElement[];
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      const scrollPosition = containerRef.current.scrollLeft;
      const childIndex = childScrollPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
          ? index
          : prev;
      }, 0);

      if (isScrolling.current) {
        return;
      }

      if (isSnapping.current) {
        return;
      }

      isSnapping.current = true;
      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      timer = setTimeout(() => {
        isSnapping.current = false;
      }, 1000);
    });

    containerRef.current.addEventListener('scroll', handleScroll);
    containerRef.current.addEventListener('scrollend', handleScrollend);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
      containerRef.current?.removeEventListener('scrollend', handleScrollend);
      clearInterval(interval);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return containerRef;
}
