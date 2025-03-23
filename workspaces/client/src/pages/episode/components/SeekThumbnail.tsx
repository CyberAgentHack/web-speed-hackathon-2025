import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef, useMemo, useEffect, useState } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useSeekThumbnail } from '@wsh-2025/client/src/pages/episode/hooks/useSeekThumbnail';

const SEEK_THUMBNAIL_WIDTH = 160;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// カスタムフック: 親要素の bounding rect を監視する
const useParentRect = (ref: React.RefObject<HTMLElement>) => {
  const [rect, setRect] = useState(() =>
    ref.current?.parentElement?.getBoundingClientRect() || { left: 0, width: 0 }
  );

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const updateRect = () => {
      setRect(parent.getBoundingClientRect());
    };

    updateRect();

    const resizeObserver = new ResizeObserver(() => updateRect());
    resizeObserver.observe(parent);

    window.addEventListener('resize', updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRect);
    };
  }, [ref]);

  return rect;
};

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const seekThumbnail = useSeekThumbnail({ episode });
  const pointer = usePointer();
  const duration = useDuration();

  // 親要素の矩形情報を取得
  const parentRect = useParentRect(ref);

  // ポインター位置や duration、親要素のサイズからスタイル計算をメモ化
  const computedStyle = useMemo(() => {
    const relativeX = pointer.x - parentRect.left;
    const percentage = parentRect.width ? Math.max(0, Math.min(relativeX / parentRect.width, 1)) : 0;
    const pointedTime = duration * percentage;

    // サムネイルが画面からはみ出ないようにサムネイル中央を基準として left を計算
    const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
    const MAX_LEFT = parentRect.width - SEEK_THUMBNAIL_WIDTH / 2;

    return {
      backgroundPositionX: -SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
      left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
    };
  }, [pointer.x, parentRect.left, parentRect.width, duration]);

  return (
    <div
      ref={ref}
      className={`absolute h-[90px] w-[160px] bg-[size:auto_100%] bg-[url(${seekThumbnail})] bottom-0 translate-x-[-50%]`}
      style={computedStyle}
    />
  );
};
