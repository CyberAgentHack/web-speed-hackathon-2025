import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

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
const debounce = (callback: () => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
  };
};

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMemo(() => containerRef.current?.getBoundingClientRect().width ?? 0, [containerRef.current]);
  const dynamicHeight = (width * ratioHeight) / ratioWidth;
  const [height, setHeight] = useState(dynamicHeight);
  useEffect(() => {
    if (!containerRef.current) return;
    const onResize = debounce(() => {
      if (!containerRef.current) return;
      const w = containerRef.current.getBoundingClientRect().width ?? 0;
      const h = (w * ratioHeight) / ratioWidth;
      setHeight(h);
    }, 200);
    containerRef.current.addEventListener('resize', onResize);
    return () => {
      containerRef.current?.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{ height: `${height}px` }} ref={containerRef} className={`relative w-full`}>
      {children}
    </div>
  );
};
