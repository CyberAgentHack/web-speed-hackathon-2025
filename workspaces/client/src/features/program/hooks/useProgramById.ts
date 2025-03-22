import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const state = useStore((s) => s.features.program.programs[programId]);

  return state;
}
