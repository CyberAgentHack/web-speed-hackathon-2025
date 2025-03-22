import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const isSnapping = useRef(false);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const container = containerRef.current;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (isScrolling.current) {
        return;
      }

      isScrolling.current = true;

      // スクロール終了検出のためのタイマーをリセット
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }

      scrollEndTimer = setTimeout(() => {
        isScrolling.current = false;

        // スクロールが止まったらスナップを実行
        if (!isSnapping.current) {
          performSnap();
        }
      }, 150); // スクロール停止を検出するための短い遅延
    };

    const performSnap = () => {
      if (isSnapping.current) return;

      const childElements = Array.from(container.children) as HTMLElement[];
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      const scrollPosition = container.scrollLeft;

      // 最も近い子要素のインデックスを見つける
      const childIndex = childScrollPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
          ? index
          : prev;
      }, 0);

      isSnapping.current = true;

      container.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      // スナップアニメーション完了のタイマー
      if (snapTimer) {
        clearTimeout(snapTimer);
      }

      snapTimer = setTimeout(() => {
        isSnapping.current = false;
      }, 500); // スクロールアニメーションが完了する十分な時間
    };

    // scrollendイベントがサポートされている場合は使用（モダンブラウザ）
    const handleScrollEnd = () => {
      if (!isScrolling.current) return;

      isScrolling.current = false;

      if (!isSnapping.current) {
        performSnap();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // scrollendイベントはモダンブラウザでのみ対応
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', handleScrollEnd);
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);

      if ('onscrollend' in window) {
        container.removeEventListener('scrollend', handleScrollEnd);
      }

      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }

      if (snapTimer) {
        clearTimeout(snapTimer);
      }
    };
  }, [scrollPadding]);

  return containerRef;
}
