import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useEffect, useRef, useState } from 'react';
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

  const pointer = usePointer();

  useEffect(() => {
    const checkHover = () => {
      const elementRect = elementRef.current?.getBoundingClientRect();

      if (!elementRect) return;

      const isHovered =
        pointer.x >= elementRect.left &&
        pointer.x <= elementRect.right &&
        pointer.y >= elementRect.top &&
        pointer.y <= elementRect.bottom;

      setHovered(isHovered);
    };

    checkHover();
  }, [pointer.x, pointer.y]);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
