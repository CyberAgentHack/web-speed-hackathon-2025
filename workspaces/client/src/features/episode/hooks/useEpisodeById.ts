import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useState } from 'react';
import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type Episode = StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;

export function useEpisode(episodeId: string) {
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {

    if (!episodeId) {
      setEpisode(null);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const data = await episodeService.fetchEpisodeById({ episodeId });
        if (isMounted) {
          setEpisode(data);
        }
      } catch (error) {
        if (isMounted) {
          setEpisode(null);
        }
      }
    })();


    return () => {
      isMounted = false;
    };
  }, [episodeId]);

  return episode;
}
