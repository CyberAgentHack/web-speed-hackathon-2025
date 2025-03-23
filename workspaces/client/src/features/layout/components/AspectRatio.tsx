import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const AspectRatio = ({ children }: Props) => {
  return <div className={'relative aspect-video'}>{children}</div>;
};
