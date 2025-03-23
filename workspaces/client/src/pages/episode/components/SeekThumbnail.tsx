import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef, useState, useEffect } from 'react';

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
  const pointer = usePointer();
  const duration = useDuration();

  const elementRect = ref.current?.parentElement?.getBoundingClientRect() ?? { left: 0, width: 0 };
  const relativeX = pointer.x - elementRect.left;

  const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
  const pointedTime = duration * percentage;

  // サムネイルが画面からはみ出ないようにサムネイル中央を基準として left を計算する
  const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
  const MAX_LEFT = elementRect.width - SEEK_THUMBNAIL_WIDTH / 2;

  // サムネイルが読み込まれていない場合はローディング表示
  if (!seekThumbnail) {
    return (
      <div
        ref={ref}
        className="absolute bottom-0 h-[90px] w-[160px] translate-x-[-50%] bg-[#333333] flex items-center justify-center"
        style={{
          left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
        }}
      >
        <span className="text-[12px] text-white">Loading...</span>
      </div>
    );
  }
// サムネイルの位置を計算
// サーバーサイドで生成されたサムネイルは複数枚のサムネイルが横に並んだ画像
// 固定の数（20枚）を使用する
const thumbnailCount = 20; // 最大サムネイル数

// パーセンテージに基づいてサムネイルインデックスを計算
const thumbnailIndex = Math.min(thumbnailCount - 1, Math.floor(percentage * thumbnailCount));

  return (
    <div
      ref={ref}
      className="absolute bottom-0 h-[90px] w-[160px] translate-x-[-50%]"
      style={{
        backgroundImage: `url(${seekThumbnail})`,
        backgroundSize: '3200px 90px', // 20枚のサムネイル (160px * 20)
        backgroundPosition: `-${thumbnailIndex * SEEK_THUMBNAIL_WIDTH}px 0`,
        left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
      }}
    />
  );
};
