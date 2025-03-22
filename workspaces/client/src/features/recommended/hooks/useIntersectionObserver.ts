import { RefObject, useEffect, useState } from 'react';

/**
 * 要素が表示されているかを監視するカスタムフック
 * 複数のコンポーネントで共有することで、IntersectionObserverの生成を最適化
 */
export function useIntersectionObserver<T extends Element>(
  elementRef: RefObject<T>,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '100px' }
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 要素がない場合は何もしない
    if (!elementRef.current) return;

    // 既に表示されている場合は何もしない
    if (isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          // 一度表示されたら監視を停止
          observer.disconnect();
        }
      },
      options
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, isVisible, options]);

  return isVisible;
}