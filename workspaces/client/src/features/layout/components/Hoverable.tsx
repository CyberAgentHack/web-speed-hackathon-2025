import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useRef, useState, useEffect } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      isHovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
