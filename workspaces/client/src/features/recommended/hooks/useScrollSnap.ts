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

    let rafId: number | null = null;
    const checkAndSnapScroll = () => {
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
        rafId = requestAnimationFrame(checkAndSnapScroll);
        return;
      }

      if (isSnapping.current) {
        rafId = requestAnimationFrame(checkAndSnapScroll);
        return;
      }

      isSnapping.current = true;
      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      const timer = setTimeout(() => {
        isSnapping.current = false;
      }, 1000);

      rafId = requestAnimationFrame(checkAndSnapScroll);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    };

    const initialRafId = requestAnimationFrame(checkAndSnapScroll);

    containerRef.current.addEventListener('scroll', handleScroll);
    containerRef.current.addEventListener('scrollend', handleScrollend);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
      containerRef.current?.removeEventListener('scrollend', handleScrollend);

      if (initialRafId) cancelAnimationFrame(initialRafId);
    };
  }, [scrollPadding]);

  return containerRef;
}
