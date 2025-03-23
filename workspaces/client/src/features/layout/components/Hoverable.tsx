import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useRef, useState } from 'react';
import { useMergeRefs } from 'use-callback-ref';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      isHovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });
};
