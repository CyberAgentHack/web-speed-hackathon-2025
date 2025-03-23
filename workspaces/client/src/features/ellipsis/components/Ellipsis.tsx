import classNames from "classnames";
import { EllipsisProps } from "react-ellipsis-component/dist/type";

export const Ellipsis = ({
  maxLine,
  text,
  ..._
}: EllipsisProps) => {
  const className = classNames(
    maxLine === 1 ? "line-clamp-1" : null,
    maxLine === 2 ? "line-clamp-2" : null,
    maxLine === 3 ? "line-clamp-3" : null,
    maxLine === 4 ? "line-clamp-4" : null,
  )
  return <span className={className}>{text}</span>
}
