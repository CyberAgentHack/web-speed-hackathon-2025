
import useSWR from 'swr';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';



interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const episodeFetcher = episodeService.fetchEpisodeById({
    episodeId,
  })
  const { data: episode } = useSWR(
    `/episode/${episodeId}`,
    () => episodeFetcher,
    { suspense: true }
  )

  return { episode };
}
