export interface PlayerWrapper {
  readonly currentTime: number;
  destory(): void;
  readonly duration: number;
  load(playlistUrl: string, options: { loop: boolean }): void;
  readonly muted: boolean;
  pause(): void;
  readonly paused: boolean;
  play(): void;
  seekTo(second: number): void;
  setMuted(muted: boolean): void;
  readonly videoElement: HTMLVideoElement;
}
