import { programService } from '@wsh-2025/client/src/features/program/services/programService';
import { useEffect, useState } from 'react';
interface Params {
  programId: string;
}

export function useNextProgram({ programId }: Params) {
  const [data, setData] = useState<Awaited<ReturnType<typeof programService.fetchNextNextProgram>>>();

  useEffect(() => {
    void (async () => {
      const nextProgram = await programService.fetchNextNextProgram({ programId });
      setData(nextProgram);
    })();
  }, []);

  return data;
}
