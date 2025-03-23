import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const snapToClosestChild = () => {
      if (!containerRef.current || isSnapping.current) return;

      const childElements = Array.from(containerRef.current.children) as HTMLElement[];
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      const scrollPosition = containerRef.current.scrollLeft;

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

      // スナップアニメーション終了後にフラグをリセット
      setTimeout(() => {
        isSnapping.current = false;
      }, 300);
    };

    // スクロール終了時のイベントハンドラ
    const handleScrollEnd = () => {
      snapToClosestChild();
    };

    // ブラウザがscrollendをサポートしていない場合のフォールバック
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        handleScrollEnd();
      }, 150); // スクロールが150ms停止したら「終了」とみなす
    };

    // モダンブラウザではscrollendイベントを使用
    if ('onscrollend' in window) {
      containerRef.current.addEventListener('scrollend', handleScrollEnd);
    } else {
      // 古いブラウザではスクロールイベントとタイムアウトを組み合わせる
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scrollend', handleScrollEnd);
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollPadding]);

  return containerRef;
}
