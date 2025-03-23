import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const state = useLoaderData<StoreState>();

  const program = state.features.program.programs[programId];

  return program;
}
