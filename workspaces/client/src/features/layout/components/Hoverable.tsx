import { Children, cloneElement, ReactElement, Ref, useState } from 'react';

// 子要素に必要なプロパティの型を定義
interface ChildProps {
  ref?: Ref<unknown> | undefined;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

interface Props {
  // 子要素の型を拡張した型にする
  children: ReactElement<ChildProps>;
  style: {
    default?: React.CSSProperties;
    hovered?: React.CSSProperties;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const [isHovered, setIsHovered] = useState(false);

  return cloneElement(child, {
    ref: child.props.ref,
    style: {
      ...child.props.style,
      cursor: 'pointer',
      ...(isHovered ? props.style.hovered : props.style.default),
    },
    onMouseEnter: (e: React.MouseEvent) => {
      setIsHovered(true);
      // 元のハンドラがあれば呼び出す
      if (child.props.onMouseEnter) {
        child.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      setIsHovered(false);
      // 元のハンドラがあれば呼び出す
      if (child.props.onMouseLeave) {
        child.props.onMouseLeave(e);
      }
    },
  });
};
