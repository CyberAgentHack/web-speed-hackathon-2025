import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export function useSelectedProgramId() {
  const selectedProgramId = useStore((s) => s.pages.timetable.selectedProgramId);
  const selectProgram = useStore((s) => s.pages.timetable.selectProgram);

  const setProgram = (program: Program | null) => {
    selectProgram(program);
  };

  return [selectedProgramId, setProgram] as const;
}
