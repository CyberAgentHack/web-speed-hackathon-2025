import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/openapi/schema';
import { ArrayValues } from 'type-fest';

import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

type ReferenceId = string;
type RecommendedModuleId = string;

interface RecommendedState {
  recommendedModules: Record<
    RecommendedModuleId,
    ArrayValues<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>
  >;
  references: Record<ReferenceId, RecommendedModuleId[]>;
}

interface RecommendedActions {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: ReferenceId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>;
}

export const createRecommendedStoreSlice = () => {
  return lens<RecommendedState & RecommendedActions>((set) => ({
    fetchRecommendedModulesByReferenceId: async ({ referenceId }) => {
      const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId });
      set((state) => {
        const updatedRecommendedModules = { ...state.recommendedModules };
        for (const module of modules) {
          updatedRecommendedModules[module.id] = module;
        }
        return {
          ...state,
          recommendedModules: updatedRecommendedModules,
          references: {
            ...state.references,
            [referenceId]: modules.map((module) => module.id)
          }
        };
      });
      return modules;
    },
    recommendedModules: {},
    references: {},
  }));
};
