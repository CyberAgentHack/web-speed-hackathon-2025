import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${ratioWidth}/${ratioHeight}` }}>
      {children}
    </div>
  );
};
