import { ReactNode, useEffect, useRef } from 'react';
import { useUpdate } from 'react-use';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const forceUpdate = useUpdate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      forceUpdate();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const width = containerRef.current?.getBoundingClientRect().width ?? 0;
  const height = (width * ratioHeight) / ratioWidth;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${height}px` }}>
      {children}
    </div>
  );
};
