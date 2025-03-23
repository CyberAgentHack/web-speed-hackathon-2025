import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useRef, useEffect, useState } from 'react';
import { useMergeRefs } from 'use-callback-ref';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHovered(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
