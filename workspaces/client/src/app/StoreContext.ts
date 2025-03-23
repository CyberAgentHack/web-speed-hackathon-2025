import { createContext, useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';

import { Store, StoreState } from '@wsh-2025/client/src/app/createStore';

export const StoreContext = createContext<Store | null>(null);

export const useStore = <T>(selector: (state: StoreState) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return useZustandStore(store, selector);
};
