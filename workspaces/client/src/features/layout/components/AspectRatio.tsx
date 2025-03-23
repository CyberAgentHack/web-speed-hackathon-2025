import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const aspectRatio = `${ratioWidth} / ${ratioHeight}`;

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      {children}
    </div>
  );
};
