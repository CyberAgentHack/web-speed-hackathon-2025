import { StandardSchemaV1 } from '@standard-schema/spec';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useLoaderData } from 'react-router';
import * as schema from '@wsh-2025/schema/src/api/schema';

interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const { program: prefetchedProgram } = useLoaderData() as {
    program: StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>;
  };
  if (prefetchedProgram) {
    return prefetchedProgram;
  }
  const state = useStore((s) => s);

  const program = state.features.program.programs[programId];

  return program;
}
