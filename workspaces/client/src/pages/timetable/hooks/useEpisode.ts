// import { StandardSchemaV1 } from '@standard-schema/spec';
// import * as schema from '@wsh-2025/schema/src/api/schema';
import useSWR from 'swr';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

// type Episode = StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;

export function useEpisode(episodeId: string) {
  const { data: episode } = useSWR(
    `/episode/${episodeId}`,
    () => episodeService.fetchEpisodeById({ episodeId }),
    {
      suspense: true,
    }
  );

  return { episode };
}
