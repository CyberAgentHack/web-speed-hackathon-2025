import useSWR from "swr";

import { programService } from "@wsh-2025/client/src/features/program/services/programService";

export const useProgramList = () => {
  const fetcher = programService.fetchPrograms();
  const { data: programList } = useSWR('/programs', () => fetcher, {
    suspense: true,
  });

  return { programList };
}