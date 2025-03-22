import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useSeekThumbnail } from '@wsh-2025/client/src/pages/episode/hooks/useSeekThumbnail';

const SEEK_THUMBNAIL_WIDTH = 160;
// const SEEK_THUMBNAIL_HEIGHT = 90;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { thumbnailUrl, loading, error } = useSeekThumbnail({ episode });
  const pointer = usePointer();
  const duration = useDuration();

  if (loading || error || !thumbnailUrl) {
    return null;
  }

  const elementRect = ref.current?.parentElement?.getBoundingClientRect() ?? { left: 0, width: 0 };
  const relativeX = pointer.x - elementRect.left;
  const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
  const pointedTime = duration * percentage;

  // サムネイルが画面からはみ出ないように中央揃え
  const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
  const MAX_LEFT = elementRect.width - SEEK_THUMBNAIL_WIDTH / 2;
  const left = Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT));

  return (
    <div
      ref={ref}
      aria-label={`Preview at ${Math.floor(pointedTime)} seconds`}
      className="absolute bottom-0 h-[90px] w-[160px] translate-x-[-50%] bg-cover bg-center"
      style={{
        backgroundImage: `url(${thumbnailUrl})`,
        left,
      }}
    />
  );
};
