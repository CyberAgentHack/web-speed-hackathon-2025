import { create } from 'zustand';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { recommendedService } from '../services/recommendedService';

type RecommendedState = {
  modules: StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse> | null;
  isLoading: boolean;
  error: Error | null;
  fetchModules: (referenceId: string) => Promise<void>;
};

export const useRecommendedStore = create<RecommendedState>((set) => ({
  modules: null,
  isLoading: false,
  error: null,
  fetchModules: async (referenceId: string) => {
    try {
      set({ isLoading: true, error: null });
      const modules = await recommendedService.fetchRecommendedModulesByReferenceId(referenceId);
      set({ modules, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
})); 