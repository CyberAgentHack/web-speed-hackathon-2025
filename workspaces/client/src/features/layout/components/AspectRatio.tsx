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
    // Calculate initial height
    updateHeight();

    // Set up resize observer to update height when container width changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [ratioHeight, ratioWidth]);

  const updateHeight = () => {
    const width = containerRef.current?.getBoundingClientRect().width ?? 0;
    setHeight((width * ratioHeight) / ratioWidth);
  };

  return (
    <div ref={containerRef} style={{ height: `${height}px` }} className="relative w-full">
      {children}
    </div>
  );
};
