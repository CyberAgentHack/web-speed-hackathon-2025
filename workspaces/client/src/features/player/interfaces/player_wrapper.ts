import type { PlayerType } from "@wsh-2025/client/src/features/player/constants/player_type";

export interface PlayerWrapper {
	readonly currentTime: number;
	destory(): void;
	readonly duration: number;
	load(playlistUrl: string, options: { loop: boolean }): void;
	readonly muted: boolean;
	pause(): void;
	readonly paused: boolean;
	play(): void;
	readonly playerType: PlayerType;
	seekTo(second: number): void;
	setMuted(muted: boolean): void;
	readonly videoElement: HTMLVideoElement;
}
