import { lens } from '@dhmk/zustand-lens';
import { produce } from 'immer';

import {
  recommendedService,
  RecommendedModule,
} from '@wsh-2025/client/src/features/recommended/services/recommendedService';

type ReferenceId = string;
type RecommendedModuleId = string;

interface RecommendedState {
  recommendedModules: Record<RecommendedModuleId, RecommendedModule>;
  references: Record<ReferenceId, RecommendedModuleId[]>;
}

interface RecommendedActions {
  fetchRecommendedModulesByReferenceId: (params: { referenceId: ReferenceId }) => Promise<RecommendedModule[]>;
}

export const createRecommendedStoreSlice = () => {
  return lens<RecommendedState & RecommendedActions>((set) => ({
    fetchRecommendedModulesByReferenceId: async ({ referenceId }) => {
      const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId });
      set((state) => {
        return produce(state, (draft) => {
          draft.references[referenceId] = modules.map((module) => module.id);
          for (const module of modules) {
            draft.recommendedModules[module.id] = module;
          }
        });
      });
      return modules;
    },
    recommendedModules: {},
    references: {},
  }));
};
