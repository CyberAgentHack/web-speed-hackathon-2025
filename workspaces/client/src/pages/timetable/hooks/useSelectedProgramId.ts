import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export function useSelectedProgramId() {
  const state = useStore((s) => s);
  const setProgram = (program: Program | null) => {
    state.pages.timetable.selectProgram(program);
  };
  return [state.pages.timetable.selectedProgramId, setProgram] as const;
}
