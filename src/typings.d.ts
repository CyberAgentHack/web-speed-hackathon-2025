import 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
    loading?: 'eager' | 'lazy';
  }
}
