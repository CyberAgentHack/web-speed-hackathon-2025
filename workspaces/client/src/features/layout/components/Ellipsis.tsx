interface Props {
  ellipsis?: boolean;
  maxLine: number;
  reflowOnResize?: boolean;
  text: string;
  visibleLine?: number;
}
export const Ellipsis = ({ ellipsis, maxLine, text, visibleLine }: Props) => {
  return (
    <div
      className={ellipsis ? 'w-full overflow-hidden text-ellipsis' : 'w-full overflow-hidden'}
      style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: maxLine || visibleLine }}
    >
      {text}
    </div>
  );
};
