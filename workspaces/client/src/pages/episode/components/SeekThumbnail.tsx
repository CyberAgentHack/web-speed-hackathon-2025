import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/openapi/schema';
import { useEffect, useRef, useState } from 'react';

import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useSeekThumbnail } from '@wsh-2025/client/src/pages/episode/hooks/useSeekThumbnail';

const SEEK_THUMBNAIL_WIDTH = 160;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const seekThumbnailUrl = useSeekThumbnail({ episode });
  const duration = useDuration();

  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (ev: MouseEvent) => {
      setPointer({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [ref]);

  const elementRect = ref.current?.parentElement?.getBoundingClientRect() ?? { left: 0, width: 0 };
  const relativeX = pointer.x - elementRect.left;

  const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
  const pointedTime = duration * percentage;

  // サムネイルが画面からはみ出ないようにサムネイル中央を基準として left を計算する
  const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
  const MAX_LEFT = elementRect.width - SEEK_THUMBNAIL_WIDTH / 2;

  return (
    <div
      ref={ref}
      className={`absolute h-[90px] w-[160px] bg-[size:auto_100%] bg-[url(${seekThumbnailUrl})] bottom-0 translate-x-[-50%]`}
      style={{
        backgroundPositionX: -1 * SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
        left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
      }}
    />
  );
};
