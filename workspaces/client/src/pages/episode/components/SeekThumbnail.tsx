import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useSeekThumbnail } from '@wsh-2025/client/src/pages/episode/hooks/useSeekThumbnail';

const SEEK_THUMBNAIL_WIDTH = 160;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const seekThumbnail = useSeekThumbnail({ episode });
  const { x: pointerX } = usePointer();
  const duration = useDuration();

  const calculateThumbnailPosition = () => {
    const parentElement = ref.current?.parentElement;
    if (!parentElement) return { backgroundPositionX: 0, left: 0 };

    const rect = parentElement.getBoundingClientRect();
    const relativeX = pointerX - rect.left;
    const percentage = Math.max(0, Math.min(relativeX / rect.width, 1));
    const pointedTime = duration * percentage;

    const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
    const MAX_LEFT = rect.width - SEEK_THUMBNAIL_WIDTH / 2;

    return {
      backgroundPositionX: -1 * SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
      left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
    };
  };

  const thumbnailStyle = calculateThumbnailPosition();

  return (
    <div
      ref={ref}
      className={`absolute h-[90px] w-[160px] bg-[size:auto_100%] bg-[url(${seekThumbnail})] bottom-0 translate-x-[-50%]`}
      style={thumbnailStyle}
    />
  );
};
