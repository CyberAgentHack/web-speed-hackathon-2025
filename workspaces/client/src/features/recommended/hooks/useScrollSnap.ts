import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const isSnapping = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const handleScroll = () => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;

      // Scroll処理が終了した後にsnapを実行
      clearTimeout(isSnapping.current);
      isSnapping.current = setTimeout(() => {
        if (!containerRef.current) return;

        const childElements = Array.from(containerRef.current.children) as HTMLElement[];
        const childScrollPositions = childElements.map((element) => element.offsetLeft);
        const scrollPosition = containerRef.current.scrollLeft;
        const childIndex = childScrollPositions.reduce((prev, curr, index) => {
          return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
            ? index
            : prev;
        }, 0);

        // Snap処理を実行
        containerRef.current.scrollTo({
          behavior: 'smooth',
          left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
        });

        isScrolling.current = false;
      }, 150); // 適切な遅延を設定
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
      if (isSnapping.current) {
        clearTimeout(isSnapping.current);
      }
    };
  }, [scrollPadding]);

  return containerRef;
}
