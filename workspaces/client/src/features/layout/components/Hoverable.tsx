import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref } from 'react';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      props.classNames.default,
      props.classNames.hovered,
    ),
  });
};
