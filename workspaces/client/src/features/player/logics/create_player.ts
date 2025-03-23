import HlsJs from 'hls.js';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

class HlsJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player = new HlsJs({
    enableWorker: false,
    maxBufferLength: 50,
  });
  readonly playerType: PlayerType.HlsJS;

  constructor(playerType: PlayerType.HlsJS) {
    this.playerType = playerType;
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

class ThumbnailPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: false,
    controls: false,
    muted: true,
    preload: 'metadata',
  });
  private _player: HlsJs | null = null;
  readonly playerType: PlayerType.ThumbnailPlayer;

  constructor(playerType: PlayerType.ThumbnailPlayer) {
    this.playerType = playerType;
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
    // ThumbnailPlayer は軽量化のため最小限の機能だけを使う
    if (HlsJs.isSupported()) {
      this._player = new HlsJs({
        enableWorker: false,
        maxBufferLength: 5,
        maxMaxBufferLength: 10,
      });
      this._player.attachMedia(this.videoElement);
      this.videoElement.loop = options.loop;
      this._player.loadSource(playlistUrl);
    } else {
      // フォールバック
      this.videoElement.src = playlistUrl;
    }
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
    if (this._player) {
      this._player.destroy();
    }
  }
}

export const createPlayer = (playerType: PlayerType): PlayerWrapper => {
  switch (playerType) {
    case PlayerType.HlsJS: {
      return new HlsJSPlayerWrapper(playerType);
    }
    case PlayerType.ThumbnailPlayer: {
      return new ThumbnailPlayerWrapper(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
