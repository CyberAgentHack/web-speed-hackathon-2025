import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useRef, useState } from 'react';

import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';

const SEEK_THUMBNAIL_WIDTH = 160;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const seekThumbnailDir = `/public/thumbnails/${episode.streamId}`;
  const duration = useDuration();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const elementRect = ref.current?.parentElement?.getBoundingClientRect() ?? { left: 0, width: 0 };
  const relativeX = pointer.x - elementRect.left;

  const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
  const pointedTime = Math.floor(duration * percentage);

  // サムネイルが画面からはみ出ないようにサムネイル中央を基準として left を計算する
  const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
  const MAX_LEFT = elementRect.width - SEEK_THUMBNAIL_WIDTH / 2;
  console.log(pointer);
  console.log({ left: elementRect.left, relativeX });

  useEffect(() => {
    const mouseMoveListener = (event) => {
      setPointer({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', mouseMoveListener);

    return () => {
      window.removeEventListener('mousemove', mouseMoveListener);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={`absolute bottom-0 h-[90px] w-[160px] translate-x-[-50%] bg-[size:auto_100%]`}
      draggable={true}
      style={{
        backgroundImage: `url(${seekThumbnailDir}/image_${pointedTime.toString().padStart(4, '0')}.webp)`,
        left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
      }}
    />
  );
};
