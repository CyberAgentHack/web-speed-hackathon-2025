import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export function useSelectedProgramId() {
  console.log('useSelectedProgramId');
  const selectedProgramState = useStore((s) => s.pages.timetable.selectProgram);
  const {
    selectedProgramId,
    selectProgram
  } = selectedProgramState;

  const setProgram = (program: Program | null) => {
    selectProgram(program);
  };
  return [selectedProgramId, setProgram] as const;
}
