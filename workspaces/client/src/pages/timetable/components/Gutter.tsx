import { type PointerEvent, type ReactElement, useState } from 'react';

import { useChangeColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useChangeColumnWidth';

interface Props {
  channelId: string;
}

export const Gutter = ({ channelId }: Props): ReactElement => {
  const changeColumnWidth = useChangeColumnWidth();

  const [lastScreenX, setLastScreenX] = useState<number | null>(null);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setLastScreenX(event.screenX);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (lastScreenX == null) {
      return;
    }
    const delta = event.screenX - lastScreenX;
    changeColumnWidth({ channelId, delta: Math.ceil(delta) });
    setLastScreenX(event.screenX);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (lastScreenX == null) {
      return;
    }
    event.currentTarget.releasePointerCapture(event.pointerId);
    const delta = event.screenX - lastScreenX;
    changeColumnWidth({ channelId, delta: Math.ceil(delta) });
    setLastScreenX(null);
  };

  return (
    <div
      className="size-full cursor-col-resize"
      role="slider"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
};
