import classNames from 'classnames';
import React, { Children, cloneElement, ReactElement, Ref, useRef, useState } from 'react';
import { useMergeRefs } from 'use-callback-ref';

// 子要素の型を拡張して HTML 属性も許容する
interface HoverableChildProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  ref?: Ref<unknown>;
}

interface Props {
  children: ReactElement<HoverableChildProps>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  // マウスのエンター／リーブでホバー状態を管理
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ref: mergedRef,
  });
};
