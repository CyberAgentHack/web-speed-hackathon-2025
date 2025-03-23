import type { ExtractState } from 'zustand/vanilla';
import { createContext } from 'zustand-di';

import { createStore } from './createStore';


export type AppState = ExtractState<ReturnType<typeof createStore>>;


const [StoreProvider, useRawStore] = createContext<AppState>();

const useStore = <T>(selector: (state: AppState) => T): T => {
  return useRawStore(selector);
};

export { StoreProvider, useStore };
