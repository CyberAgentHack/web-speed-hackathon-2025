import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useCallback } from 'react';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export function useSelectedProgramId() {
  // セレクタを最適化: 必要な状態のみを選択
  const selectedProgramId = useStore(
    useCallback((s) => s.pages.timetable.selectedProgramId, [])
  );

  const selectProgram = useStore(
    useCallback((s) => s.pages.timetable.selectProgram, [])
  );

  // setProgram関数をメモ化
  const setProgram = useCallback(
    (program: Program | null) => {
      selectProgram(program);
    },
    [selectProgram]
  );

  return [selectedProgramId, setProgram] as const;
}
