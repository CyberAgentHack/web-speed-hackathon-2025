import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  ratioHeight: number;
  ratioWidth: number;
}

export const AspectRatio = ({ children, ratioHeight, ratioWidth }: Props) => {
  const paddingTop = `${(ratioHeight / ratioWidth) * 100}%`;

  return (
    <div className="relative w-full" style={{ paddingTop }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
