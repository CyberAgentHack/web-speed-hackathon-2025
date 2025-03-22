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
    const interval = setInterval(function tick() {
      forceUpdate();
    }, 1000);
    return () => {
      clearInterval(interval);
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
