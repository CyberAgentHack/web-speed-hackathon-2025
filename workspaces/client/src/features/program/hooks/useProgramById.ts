import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const programState = useStore((s) => s.features.program);

  const program = programState.programs[programId];

  return program;
}
