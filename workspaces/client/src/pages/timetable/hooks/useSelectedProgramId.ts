import { StandardSchemaV1 } from '@standard-schema/spec';
import { getTimetableResponse } from '@wsh-2025/schema/src/openapi/schema';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>;

export function useSelectedProgramId() {
  const state = useStore((s) => s.pages.timetable);
  const setProgram = (program: Program | null) => {
    state.selectProgram(program);
  };
  return [state.selectedProgramId, setProgram] as const;
}
