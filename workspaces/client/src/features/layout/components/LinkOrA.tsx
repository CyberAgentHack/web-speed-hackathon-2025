import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

export const LinkOrA = ({ children, to, ...props }: { children: ReactNode; to: string; [key: string]: unknown }) => {
  if (typeof window === 'undefined') {
    // SSR時はaタグ
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }
  // クライアントではreact-routerのLink
  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
};
