import { ReactNode, useEffect, useRef , useState} from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const [height, setHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.getBoundingClientRect().width;
      setHeight((width * ratioHeight) / ratioWidth);
    };

    // 初回
    calculateHeight();
    
    // リサイズ時のみ計算
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, [ratioHeight, ratioWidth]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${height}px` }}>
      {children}
    </div>
  );
};
