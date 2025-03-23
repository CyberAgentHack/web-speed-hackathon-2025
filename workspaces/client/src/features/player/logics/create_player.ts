import "@videojs/http-streaming";
import type HlsJs from "hls.js";
import type shaka from "shaka-player";

import { PlayerType } from "@wsh-2025/client/src/features/player/constants/player_type";
import { PlayerWrapper } from "@wsh-2025/client/src/features/player/interfaces/player_wrapper";

class ShakaPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement("video"), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: shaka.Player;
  readonly playerType: PlayerType.ShakaPlayer;

  constructor(playerType: PlayerType.ShakaPlayer, shakaModule: typeof shaka) {
    this.playerType = playerType;
    this._player = new shakaModule.Player(this.videoElement);
    this._player.configure({
      streaming: {
        bufferingGoal: 50,
      },
    });
  }

  get currentTime(): number {
    const currentTime = this.videoElement.currentTime;
    return Number.isNaN(currentTime) ? 0 : currentTime;
  }
  get paused(): boolean {
    return this.videoElement.paused;
  }
  get duration(): number {
    const duration = this.videoElement.duration;
    return Number.isNaN(duration) ? 0 : duration;
  }
  get muted(): boolean {
    return this.videoElement.muted;
  }

  load(playlistUrl: string, options: { loop: boolean }): void {
    void (async () => {
      await this._player.attach(this.videoElement);
      this.videoElement.loop = options.loop;
      await this._player.load(playlistUrl);
    })();
  }
  play(): void {
    void this.videoElement.play();
  }
  pause(): void {
    this.videoElement.pause();
  }
  seekTo(second: number): void {
    this.videoElement.currentTime = second;
  }
  setMuted(muted: boolean): void {
    this.videoElement.muted = muted;
  }
  destory(): void {
    void this._player.destroy();
  }
}

class HlsJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement("video"), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: HlsJs;
  readonly playerType: PlayerType.HlsJS;

  constructor(playerType: PlayerType.HlsJS, HlsJsModule: typeof HlsJs) {
    this.playerType = playerType;
    this._player = new HlsJsModule({
      enableWorker: false,
      maxBufferLength: 50,
    });
  }

  get currentTime(): number {
    const currentTime = this.videoElement.currentTime;
    return Number.isNaN(currentTime) ? 0 : currentTime;
  }
  get paused(): boolean {
    return this.videoElement.paused;
  }
  get duration(): number {
    const duration = this._player.media?.duration ?? 0;
    return Number.isNaN(duration) ? 0 : duration;
  }
  get muted(): boolean {
    return this.videoElement.muted;
  }

  load(playlistUrl: string, options: { loop: boolean }): void {
    this._player.attachMedia(this.videoElement);
    this.videoElement.loop = options.loop;
    this._player.loadSource(playlistUrl);
  }
  play(): void {
    void this.videoElement.play();
  }
  pause(): void {
    this.videoElement.pause();
  }
  seekTo(second: number): void {
    this.videoElement.currentTime = second;
  }
  setMuted(muted: boolean): void {
    this.videoElement.muted = muted;
  }
  destory(): void {
    this._player.destroy();
  }
}

interface VhsConfig {
  GOAL_BUFFER_LENGTH: number;
  MAX_GOAL_BUFFER_LENGTH: number;
}

class VideoJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement("video"), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: any;
  readonly playerType: PlayerType.VideoJS;

  constructor(playerType: PlayerType.VideoJS, videojs: any) {
    this.playerType = playerType;
    const vhsConfig = (videojs as unknown as { Vhs: VhsConfig }).Vhs;
    vhsConfig.GOAL_BUFFER_LENGTH = 50;
    vhsConfig.MAX_GOAL_BUFFER_LENGTH = 50;
    this._player = videojs(this.videoElement);
  }

  get currentTime(): number {
    return this._player.currentTime() ?? 0;
  }
  get paused(): boolean {
    return this._player.paused();
  }
  get duration(): number {
    return this._player.duration() ?? 0;
  }
  get muted(): boolean {
    return this._player.muted() ?? true;
  }

  load(playlistUrl: string, options: { loop: boolean }): void {
    this.videoElement.loop = options.loop;
    this._player.src({
      src: playlistUrl,
      type: "application/x-mpegURL",
    });
  }
  play(): void {
    void this.videoElement.play();
  }
  pause(): void {
    this.videoElement.pause();
  }
  seekTo(second: number): void {
    this.videoElement.currentTime = second;
  }
  setMuted(muted: boolean): void {
    this._player.muted(muted);
  }
  destory(): void {
    this._player.dispose();
  }
}

export const createPlayer = async (
  playerType: PlayerType,
): Promise<PlayerWrapper> => {
  switch (playerType) {
    case PlayerType.ShakaPlayer: {
      const { default: shaka } = await import("shaka-player");
      return new ShakaPlayerWrapper(playerType, shaka);
    }
    case PlayerType.HlsJS: {
      const { default: HlsJs } = await import("hls.js");
      return new HlsJSPlayerWrapper(playerType, HlsJs);
    }
    case PlayerType.VideoJS: {
      const { default: videojs } = await import("video.js");
      return new VideoJSPlayerWrapper(playerType, videojs);
    }
    default: {
      playerType satisfies never;
      throw new Error("Invalid player type.");
    }
  }
};
