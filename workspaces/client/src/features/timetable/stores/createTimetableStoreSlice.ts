import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { produce } from 'immer';
import { ArrayValues } from 'type-fest';

import { timetableService } from '@wsh-2025/client/src/features/timetable/services/timetableService';
import { getTimetableResponse } from '@wsh-2025/schema/src/openapi/schema';

type ProgramId = string;

interface TimetableState {
  programs: Record<ProgramId, ArrayValues<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>>;
}

interface TimetableActions {
  fetchTimetable: (params: {
    since: string;
    until: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>;
}

export const createTimetableStoreSlice = () => {
  return lens<TimetableState & TimetableActions>((set) => ({
    fetchTimetable: async ({ since, until }) => {
      const programs = await timetableService.fetchTimetable({ since, until });
      set((state) => {
        return produce(state, (draft) => {
          draft.programs = {};
          for (const program of programs) {
            draft.programs[program.id] = program;
          }
        });
      });
      return programs;
    },
    programs: {},
  }));
};
