import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, RefObject, useCallback, useRef } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

// 自前のuseMergeRefs実装
const useMergeRefs = <T,>(refs: (Ref<T> | null | undefined)[]) => {
  return useCallback((value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as RefObject<T>).current = value;
      }
    });
  }, [refs]);
};

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  const pointer = usePointer();
  const elementRect = elementRef.current?.getBoundingClientRect();

  const hovered =
    elementRect != null &&
    elementRect.left <= pointer.x &&
    pointer.x <= elementRect.right &&
    elementRect.top <= pointer.y &&
    pointer.y <= elementRect.bottom;

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
