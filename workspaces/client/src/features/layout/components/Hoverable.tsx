import classNames from 'classnames';
import { cloneElement, MouseEvent, ReactElement, useState } from 'react';

interface Props {
  children: ReactElement<{
    className?: string;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
  }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = ({ children, classNames: customClassNames }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return cloneElement(children, {
    className: classNames(
      children.props.className,
      'cursor-pointer',
      isHovered ? customClassNames.hovered : customClassNames.default,
    ),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });
};
