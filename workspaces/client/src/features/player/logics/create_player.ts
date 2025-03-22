import '@videojs/http-streaming';
import HlsJs from 'hls.js';
import videojs from 'video.js';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';
import { loadShaka } from '@wsh-2025/client/src/features/player/utils/shaka-loader';

class ShakaPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: any = null;
  readonly playerType: PlayerType.ShakaPlayer;

  constructor(playerType: PlayerType.ShakaPlayer) {
    this.playerType = playerType;
    // 初期化は非同期で行いますが、コンストラクタは同期的に実行する必要があります
    this.initPlayer().catch(console.error);
  }

  private async initPlayer() {
    if (this._player) return;

    try {
      const shaka = await loadShaka();
      this._player = new shaka.Player();
      this._player.configure({
        streaming: {
          bufferingGoal: 50,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Shaka Player:', error);
    }
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

  async load(playlistUrl: string, options: { loop: boolean }): Promise<void> {
    await this.initPlayer();
    if (!this._player) {
      console.error('Shaka Player is not initialized');
      return;
    }

    try {
      await this._player.attach(this.videoElement);
      this.videoElement.loop = options.loop;
      await this._player.load(playlistUrl);
    } catch (error) {
      console.error('Failed to load media in Shaka Player:', error);
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
      void this._player.destroy();
      this._player = null;
    }
  }
}

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

interface VhsConfig {
  GOAL_BUFFER_LENGTH: number;
  MAX_GOAL_BUFFER_LENGTH: number;
}

class VideoJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player = videojs(this.videoElement);
  readonly playerType: PlayerType.VideoJS;

  constructor(playerType: PlayerType.VideoJS) {
    const vhsConfig = (videojs as unknown as { Vhs: VhsConfig }).Vhs;
    vhsConfig.GOAL_BUFFER_LENGTH = 50;
    vhsConfig.MAX_GOAL_BUFFER_LENGTH = 50;
    this.playerType = playerType;
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
      type: 'application/x-mpegURL',
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

export const createPlayer = (playerType: PlayerType): PlayerWrapper => {
  switch (playerType) {
    case PlayerType.ShakaPlayer: {
      return new ShakaPlayerWrapper(playerType);
    }
    case PlayerType.HlsJS: {
      return new HlsJSPlayerWrapper(playerType);
    }
    case PlayerType.VideoJS: {
      return new VideoJSPlayerWrapper(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
