import { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const [width, setWidth] = useState(MIN_WIDTH);  // 初期幅をMIN_WIDTHに設定
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current == null) {
        return;
      }

      const styles = window.getComputedStyle(containerRef.current);
      const innerWidth = containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
      const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
      const itemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);
      setWidth(itemWidth);  // 計算した幅を設定
    };

    // 初回レンダリング時に幅を更新
    updateWidth();

    // ウィンドウのリサイズイベントで再計算
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);  // クリーンアップ
    };
  }, []);  // コンポーネントのマウントとアンマウント時だけ実行

  return { ref: containerRef, width };  // 計算した幅を返す
}
