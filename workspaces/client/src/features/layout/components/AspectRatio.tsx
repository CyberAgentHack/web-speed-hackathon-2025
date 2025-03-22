import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        containerRef.current.style.height = `${(width * ratioHeight) / ratioWidth}px`;
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 初期化処理
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [ratioHeight, ratioWidth]);

  return (
    <div ref={containerRef} className="relative w-full">
      {children}
    </div>
  );
};