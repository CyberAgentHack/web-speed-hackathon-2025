import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import { useEffect, useState } from 'react';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type Episode = StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;

export function useEpisode(episodeId: string) {
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    episodeService
      .fetchEpisodeById({ episodeId })
      .then(setEpisode)
      .catch(() => {
        setEpisode(null);
      });
  }, [episodeId]);

  return episode;
}
