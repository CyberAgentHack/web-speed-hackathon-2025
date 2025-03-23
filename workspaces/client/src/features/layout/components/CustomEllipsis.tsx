import { CSSProperties } from 'react';

interface CustomEllipsisProps {
  className?: string;
  maxLine: number;
  text: string;
  visibleLine?: number;
}

export const CustomEllipsis = ({ text, maxLine, visibleLine = maxLine, className = '' }: CustomEllipsisProps) => {
  const style: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: visibleLine,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  };

  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
};