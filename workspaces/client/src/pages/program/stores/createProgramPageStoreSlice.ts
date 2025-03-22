import { lens } from "@dhmk/zustand-lens";
import type { RefCallback } from "react";

import type { PlayerWrapper } from "@wsh-2025/client/src/features/player/interfaces/player_wrapper";

interface ProgramPageState {
	muted: boolean;
	player: PlayerWrapper | null;
}

interface ProgramPageActions {
	playerRef: RefCallback<PlayerWrapper | null>;
	setMuted: (muted: boolean) => void;
}

export const createProgramPageStoreSlice = () => {
	return lens<ProgramPageState & ProgramPageActions>((set, get) => ({
		muted: true,
		player: null,
		playerRef: (player: PlayerWrapper | null) => {
			function onMount(player: PlayerWrapper): void {
				set(() => ({ player }));
			}

			function onUnmount(): void {
				set(() => ({ player: null }));
			}

			if (player != null) {
				onMount(player);
			} else {
				onUnmount();
			}
		},
		setMuted: (muted: boolean) => {
			const { player } = get();
			player?.setMuted(muted);
			set(() => ({ muted }));
		},
	}));
};
