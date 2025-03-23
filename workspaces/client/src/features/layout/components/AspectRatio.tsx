import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  onInView?: () => void;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth, onInView }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !onInView || hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setHasIntersected(true);
          onInView();
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onInView, hasIntersected]);

  const height = (width * ratioHeight) / ratioWidth;

  return (
    <div ref={containerRef} style={{ height: `${height}px` }} className="relative w-full">
      {children}
    </div>
  );
};
