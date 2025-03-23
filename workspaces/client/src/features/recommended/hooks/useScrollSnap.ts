import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const isSnapping = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const container = containerRef.current;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (isScrolling.current) {
        return;
      }
      isScrolling.current = true;

      // スクロール停止の検出
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(() => {
        isScrolling.current = false;
        // スクロールが停止したらスナップ処理を実行
        if (!isSnapping.current) {
          performSnap();
        }
      }, 150);
    };

    const handleScrollend = () => {
      if (!isScrolling.current) {
        return;
      }
      isScrolling.current = false;

      // スクロールが終了したらスナップ処理を実行
      if (!isSnapping.current) {
        performSnap();
      }
    };

    // スナップ処理を実行する関数
    const performSnap = () => {
      if (!containerRef.current || isSnapping.current) {
        return;
      }

      const childElements = Array.from(containerRef.current.children) as HTMLElement[];
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      const scrollPosition = containerRef.current.scrollLeft;

      // 最も近い子要素のインデックスを計算
      const childIndex = childScrollPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
          ? index
          : prev;
      }, 0);

      isSnapping.current = true;
      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      // スナップアニメーション完了後にフラグをリセット
      setTimeout(() => {
        isSnapping.current = false;
      }, 500);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('scrollend', handleScrollend);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scrollend', handleScrollend);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [scrollPadding]);

  return containerRef;
}
