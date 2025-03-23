import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useCallback, useEffect, useRef, useState } from 'react';
import { useMergeRefs } from 'use-callback-ref';

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

  // マウスイベントを使用してホバー状態を管理
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // イベントリスナーを設定
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
