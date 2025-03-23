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
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      forceUpdate();
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const width = containerRef.current?.getBoundingClientRect().width ?? 0;
  const height = (width * ratioHeight) / ratioWidth;

  return (
    <div ref={containerRef} className={`h-[${height}px] relative w-full`}>
      {children}
    </div>
  );
};
