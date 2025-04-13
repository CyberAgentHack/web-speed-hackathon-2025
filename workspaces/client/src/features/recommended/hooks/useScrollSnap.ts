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
      // スクロール中であれば
      if (isScrolling.current) {
        // 何もしない
        return;
      }
      // スクロール中でなければスクロール中のフラグを立てる
      isScrolling.current = true;
    };

    const handleScrollend = () => {
      // スクロール中でなければ
      if (!isScrolling.current) {
        // 何もしない
        return;
      }
      // スクロール中であればスクロール中のフラグを外す
      isScrolling.current = false;
    };

    let timer: ReturnType<typeof setTimeout> | null = null;
    let interval = setInterval(() => {
      // スクロール中でなければ
      if (!containerRef.current) {
        // 何もしない
        return;
      }

      // 子要素を全て取得する
      const childElements = Array.from(containerRef.current.children) as HTMLElement[];
      // 子要素の位置を取得する
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      // 親要素の位置を取得する
      const scrollPosition = containerRef.current.scrollLeft;
      // 親要素と最も近い子要素の添字を取得する
      const childIndex = childScrollPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
          ? index
          : prev;
      }, 0);

      // スクロール中であれば
      if (isScrolling.current) {
        // 何もしない
        return;
      }

      // スナップ中であれば
      if (isSnapping.current) {
        // 何もしない
        return;
      }

      // スナップ中のフラグを立てる
      isSnapping.current = true;
      // 親要素に最も近い子要素の位置に揃える
      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      // 1秒後にスナップ中のフラグを下げる
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
