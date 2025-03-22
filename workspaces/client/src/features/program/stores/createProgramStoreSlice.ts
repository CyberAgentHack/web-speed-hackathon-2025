import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { programService } from '@wsh-2025/client/src/features/program/services/programService';

type ProgramId = string;

interface ProgramState {
  programs: Record<ProgramId, StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
}

interface ProgramActions {
  fetchProgramById: (params: {
    programId: ProgramId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getProgramsResponse>>;
}

export const createProgramStoreSlice = () => {
  return lens<ProgramState & ProgramActions>((set, get) => ({
    fetchProgramById: async ({ programId }) => {
      const state = get();
      if (state.programs[programId]) {
        return state.programs[programId];
      }

      const program = await programService.fetchProgramById({ programId });
      set((state) => ({
        ...state,
        programs: {
          ...state.programs,
          [program.id]: program,
        },
      }));
      return program;
    },
    fetchPrograms: async () => {
      const programs = await programService.fetchPrograms();
      set((state) => {
        const newPrograms = { ...state.programs };
        for (const program of programs) {
          newPrograms[program.id] = program;
        }
        return { ...state, programs: newPrograms };
      });
      return programs;
    },
    programs: {},
  }));
};
