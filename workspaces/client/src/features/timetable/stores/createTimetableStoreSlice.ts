import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getTimetableResponse } from '@wsh-2025/schema/src/openapi/schema';
import { ArrayValues } from 'type-fest';

import { timetableService } from '@wsh-2025/client/src/features/timetable/services/timetableService';

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
        const newPrograms: Record<ProgramId, ArrayValues<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>> = {};
        for (const program of programs) {
          newPrograms[program.id] = program;
        }
        return {
          ...state,
          programs: newPrograms
        };
      });
      return programs;
    },
    programs: {},
  }));
};
