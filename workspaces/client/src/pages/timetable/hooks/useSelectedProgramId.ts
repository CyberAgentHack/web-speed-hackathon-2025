import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export function useSelectedProgramId() {
  const timetableState = useStore((s) => s.pages.timetable);
  const setProgram = (program: Program | null) => {
    timetableState.selectProgram(program);
  };
  return [timetableState.selectedProgramId, setProgram] as const;
}
