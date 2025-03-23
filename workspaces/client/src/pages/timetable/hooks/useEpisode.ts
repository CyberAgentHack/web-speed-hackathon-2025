import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useState } from 'react';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type Episode = StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;

const episodeCache = new Map<string, Episode>();

export function useEpisode(episodeId: string) {
  const [episode, setEpisode] = useState<Episode | null>(() => {
    // 初期値としてキャッシュからデータを取得
    return episodeCache.get(episodeId) || null;
  });

  useEffect(() => {
    // 既にキャッシュにある場合はそれを使用
    if (episodeCache.has(episodeId)) {
      setEpisode(episodeCache.get(episodeId) || null);
      return;
    }

    // キャッシュにない場合はAPIリクエスト
    episodeService
      .fetchEpisodeById({ episodeId })
      .then((episode) => {
        episodeCache.set(episodeId, episode);
        setEpisode(episode);
      })
      .catch(() => {
        setEpisode(null);
      });
  }, [episodeId]);

  return episode;
}
