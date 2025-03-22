import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getProgramByIdResponse, getProgramsResponse } from '@wsh-2025/schema/src/openapi/schema';

import { programService } from '@wsh-2025/client/src/features/program/services/programService';

type ProgramId = string;

interface ProgramState {
  programs: Record<ProgramId, StandardSchemaV1.InferOutput<typeof getProgramByIdResponse>>;
}

interface ProgramActions {
  fetchProgramById: (params: {
    programId: ProgramId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getProgramByIdResponse>>;
  fetchPrograms: () => Promise<StandardSchemaV1.InferOutput<typeof getProgramsResponse>>;
}

export const createProgramStoreSlice = () => {
  return lens<ProgramState & ProgramActions>((set) => ({
    fetchProgramById: async ({ programId }) => {
      const program = await programService.fetchProgramById({ programId });
      set((state) => {
        return {
          ...state,
          programs: {
            ...state.programs,
            [program.id]: program
          }
        };
      });
      return program;
    },
    fetchPrograms: async () => {
      const programs = await programService.fetchPrograms();
      set((state) => {
        const updatedPrograms = { ...state.programs };
        for (const program of programs) {
          updatedPrograms[program.id] = program;
        }
        return {
          ...state,
          programs: updatedPrograms
        };
      });
      return programs;
    },
    programs: {},
  }));
};
