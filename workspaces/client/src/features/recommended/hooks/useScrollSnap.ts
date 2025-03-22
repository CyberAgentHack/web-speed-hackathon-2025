import { useEffect, useRef } from 'react';

import { debounce } from '@wsh-2025/client/src/utils/debounce';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const isSnapping = useRef(false);
  // 最後に計算した子要素の位置をキャッシュ
  const childPositionsCache = useRef<number[]>([]);
  // 子要素の数が変わったかどうかを追跡
  const childCountRef = useRef<number>(0);

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

      // スクロール終了時にスナップ処理を実行
      if (!isSnapping.current && containerRef.current) {
        performScrollSnap();
      }
    };

    // 子要素の位置を計算し、キャッシュする関数
    const updateChildPositions = () => {
      if (!containerRef.current) return;

      const childElements = containerRef.current.children;
      // 子要素の数が変わっていない場合はキャッシュを再利用
      if (childElements.length === childCountRef.current && childPositionsCache.current.length > 0) {
        return;
      }

      // 子要素の数が変わった場合は位置を再計算
      childCountRef.current = childElements.length;
      childPositionsCache.current = Array.from(childElements).map(
        (element) => (element as HTMLElement).offsetLeft
      );
    };

    // スクロールスナップ処理をdebounceで最適化
    const performScrollSnap = debounce(() => {
      if (!containerRef.current || isSnapping.current) return;

      isSnapping.current = true;

      // 子要素の位置を更新
      updateChildPositions();

      const scrollPosition = containerRef.current.scrollLeft;

      // 最も近い子要素のインデックスを見つける（バイナリサーチを使用）
      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      // 子要素が少ない場合は線形探索、多い場合はより効率的なアルゴリズムを検討
      for (let i = 0; i < childPositionsCache.current.length; i++) {
        const distance = Math.abs(childPositionsCache.current[i] - scrollPosition);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childPositionsCache.current[closestIndex] ?? 0) - scrollPadding,
      });

      // スナップ完了後にフラグをリセット
      setTimeout(() => {
        isSnapping.current = false;
      }, 500); // スムーススクロールの完了を待つ
    }, 100); // 100msのdebounce

    containerRef.current.addEventListener('scroll', handleScroll);
    containerRef.current.addEventListener('scrollend', handleScrollend);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
      containerRef.current?.removeEventListener('scrollend', handleScrollend);
      performScrollSnap.cancel(); // debounceされた関数をキャンセル
    };
  }, [scrollPadding]);

  return containerRef;
}
