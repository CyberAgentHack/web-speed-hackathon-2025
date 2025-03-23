import useSWR from 'swr';

import { programService } from '@wsh-2025/client/src/features/program/services/programService';
interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const fetcher = programService.fetchProgramById({ programId });
  const { data: program } = useSWR(`/program/${programId}`, () => fetcher, {
    suspense: true,
  });

  return { program };
}
