import { useStore } from "@wsh-2025/client/src/app/StoreContext";

interface Params {
	referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
	const state = useStore((s) => s);

	return state.loaderData["0-0"].modules;
}
