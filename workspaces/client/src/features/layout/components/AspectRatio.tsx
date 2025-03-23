import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      setHeight((width * ratioHeight) / ratioWidth);
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 初期計算
    updateHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [ratioHeight, ratioWidth]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${height}px` }}>
      {children}
    </div>
  );
};
