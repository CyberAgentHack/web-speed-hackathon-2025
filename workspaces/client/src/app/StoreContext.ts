import type { ExtractState } from "zustand/vanilla";
import { createContext } from "zustand-di";

import type { createStore } from "@wsh-2025/client/src/app/createStore";

const [StoreProvider, useStore] =
	createContext<ExtractState<ReturnType<typeof createStore>>>();

export { StoreProvider, useStore };
