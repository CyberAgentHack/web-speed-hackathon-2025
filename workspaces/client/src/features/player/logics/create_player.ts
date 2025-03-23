import type Hls from 'hls.js';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

// hls.jsの事前読み込み状態を管理
let preloadPromise: Promise<void> | null = null;

// アイドル時にhls.jsを事前読み込み
const preloadHlsJs = (): Promise<void> => {
  if (preloadPromise) return preloadPromise;

  preloadPromise = new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        void import(/* webpackChunkName: "hls.js" */ 'hls.js').then(() => resolve());
      }, { timeout: 3000 }); // 3秒以内に実行されなければタイムアウト
    } else {
      // requestIdleCallbackが利用できない環境では、setTimeout で代替
      setTimeout(() => {
        void import(/* webpackChunkName: "hls.js" */ 'hls.js').then(() => resolve());
      }, 1000); // メイン画面表示から1秒後
    }
  });

  return preloadPromise;
};

// メイナ画面表示後にhls.jsの事前読み込みを開始
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    void preloadHlsJs();
  });
}

class HlsJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: Hls | null = null;
  readonly playerType: PlayerType.HlsJS;

  constructor(playerType: PlayerType.HlsJS) {
    this.playerType = playerType;
  }

  private async ensurePlayer(): Promise<void> {
    if (!this._player) {
      // 事前読み込みが完了していれば、それを利用
      await preloadHlsJs();
      const { default: HlsJs } = await import(/* webpackChunkName: "hls.js" */ 'hls.js');
      this._player = new HlsJs({
        enableWorker: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 30,
        maxBufferSize: 10 * 1000 * 1000, // 10MB
        backBufferLength: 30,
        lowLatencyMode: true,
        // ABR設定の最適化
        startLevel: -1,
        abrEwmaDefaultEstimate: 500000,
        abrEwmaFastLive: 3,
        abrEwmaSlowLive: 9,
        // ネットワーク関連の設定
        maxLoadingDelay: 4,
        manifestLoadingMaxRetry: 2,
        manifestLoadingRetryDelay: 500,
        manifestLoadingMaxRetryTimeout: 2000,
        levelLoadingMaxRetry: 2,
        levelLoadingRetryDelay: 500,
        levelLoadingMaxRetryTimeout: 2000,
        fragLoadingMaxRetry: 2,
        fragLoadingRetryDelay: 500,
        fragLoadingMaxRetryTimeout: 2000,
      });
    }
  }

  async initialize(): Promise<void> {
    // 初期化時には何もしない（遅延初期化）
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
    void this.ensurePlayer().then(() => {
      if (!this._player) throw new Error('Player not initialized');
      this._player.attachMedia(this.videoElement);
      this.videoElement.loop = options.loop;
      this._player.loadSource(playlistUrl);
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
    this.videoElement.muted = muted;
  }
  destory(): void {
    this._player?.destroy();
    this._player = null;
  }
}

export const createPlayer = (playerType: PlayerType): PlayerWrapper => {
  switch (playerType) {
    case PlayerType.HlsJS: {
      return new HlsJSPlayerWrapper(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
