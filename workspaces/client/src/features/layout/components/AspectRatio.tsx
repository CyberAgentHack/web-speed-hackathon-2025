import { ReactNode, useEffect, useRef } from 'react';
import { useUpdate } from 'react-use';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

const throttle = (callback: () => void, limit: number) => {
  let waiting = false;
  return () => {
    if (!waiting) {
      callback();
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const forceUpdate = useUpdate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const onResize = throttle(() => {
      forceUpdate();
    }, 400);
    containerRef.current.addEventListener('resize', onResize);
    return () => {
      containerRef.current?.removeEventListener('resize', onResize);
    };
  }, []);

  const width = containerRef.current?.getBoundingClientRect().width ?? 0;
  const height = (width * ratioHeight) / ratioWidth;

  return (
    <div style={{ height: `${height}px` }} ref={containerRef} className={`relative w-full`}>
      {children}
    </div>
  );
};
