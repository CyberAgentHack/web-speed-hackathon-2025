import { useEffect, useState } from 'react';

interface Props {
  alt: string;
  className?: string;
  height: number;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  src: string;
  width: number;
}

export function OptimizedImage({ 
  alt,
  className,
  height,
  loading = 'lazy',
  priority = false,
  src,
  width
}: Props) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    // GIFの場合は直接読み込む
    const isGif = src.toLowerCase().endsWith('.gif');
    // GIF以外の場合はWebPのパスを生成
    return isGif ? src : src.replace(/\.(jpe?g)$/, '.webp');
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // srcが変更された場合、エラー状態をリセットし新しいsrcを設定
    setHasError(false);
    const isGif = src.toLowerCase().endsWith('.gif');
    setCurrentSrc(isGif ? src : src.replace(/\.(jpe?g)$/, '.webp'));
  }, [src]);

  return (
    <img
      alt={alt}
      className={className}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : (loading === 'eager' ? 'high' : 'auto')}
      height={height}
      loading={priority ? 'eager' : loading}
      sizes={width ? `${width}px` : '100vw'}
      src={hasError ? src : currentSrc}
      width={width}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
} 