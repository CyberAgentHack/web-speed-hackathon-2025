import { useCallback, useEffect, useState } from 'react';

export function usePointer(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  const handler = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, [setPos]);

  useEffect(() => {
    window.addEventListener('mousemove', handler);
    return (() => {
      window.removeEventListener('mousemove', handler);
    });
  }, [])
  return pos;
}
