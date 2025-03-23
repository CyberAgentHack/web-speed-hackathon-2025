import '@videojs/http-streaming';
import HlsJs from 'hls.js';
import shaka from 'shaka-player';
import videojs from 'video.js';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

class ShakaPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player = new shaka.Player();
  readonly playerType: PlayerType.ShakaPlayer;

  constructor(playerType: PlayerType.ShakaPlayer) {
    this.playerType = playerType;
    this._player.configure({
      // パフォーマンス最適化のための設定
      abr: {
        defaultBandwidthEstimate: 500000,
        enabled: true, // 初期帯域幅の見積もり（500kbps）
      },
      streaming: {
        bufferingGoal: 50,
        // useNativeHlsOnSafari: true, // SafariではネイティブHLSを使用
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
      try {
        await this._player.attach(this.videoElement);
        this.videoElement.loop = options.loop;
        await this._player.load(playlistUrl);

        // loadeddataイベントを発火させて、ローディング状態を更新
        const event = new Event('loadeddata');
        this.videoElement.dispatchEvent(event);
      } catch (error) {
        console.error('Shaka Player error:', error);

        // エラーイベントを発火させて、ローディング状態を更新
        const errorEvent = new ErrorEvent('error', {
          message: error instanceof Error ? error.message : String(error)
        });
        this.videoElement.dispatchEvent(errorEvent);
      }
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
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player = new HlsJs({
    // レベルロードの最大リトライ回数
    abrEwmaDefaultEstimate: 500000, // メインスレッドの負荷を軽減するための追加設定
    backBufferLength: 30,
    enableWorker: true,
    // バックバッファの長さを制限
    fragLoadingMaxRetry: 2,
    // マニフェストロードの最大リトライ回数
    levelLoadingMaxRetry: 2, liveSyncDurationCount: 3, // フラグメントロードの最大リトライ回数
    manifestLoadingMaxRetry: 2, // Web Workerを有効化
    maxBufferLength: 10, maxMaxBufferLength: 30, // 初期帯域幅の見積もり（500kbps）
    testBandwidth: false, // 初期帯域幅テストを無効化
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
    // イベントハンドラの設定
    this._player.once(HlsJs.Events.MEDIA_ATTACHED, () => {
      console.log('Media attached');
    });

    this._player.once(HlsJs.Events.MANIFEST_PARSED, () => {
      console.log('Manifest parsed, media ready to play');
      // loadeddataイベントを発火させて、ローディング状態を更新
      const event = new Event('loadeddata');
      this.videoElement.dispatchEvent(event);
    });

    this._player.once(HlsJs.Events.ERROR, (_, data) => {
      console.error('HLS.js error:', data);
      if (data.fatal) {
        // エラーイベントを発火させて、ローディング状態を更新
        const event = new ErrorEvent('error', { message: `HLS.js fatal error: ${data.type}` });
        this.videoElement.dispatchEvent(event);
      }
    });

    // メディアのアタッチとソースのロード
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

    // パフォーマンス最適化のための設定
    this._player.options({
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          limitRenditionByPlayerDimensions: true,
          overrideNative: !videojs.browser.IS_SAFARI,
          useDevicePixelRatio: true,
        },
      },
    });
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

    // loadeddataイベントのリスナーを追加
    const loadedDataHandler = () => {
      console.log('Video.js: Media loaded');
      // loadeddataイベントを発火させて、ローディング状態を更新
      const event = new Event('loadeddata');
      this.videoElement.dispatchEvent(event);
      this.videoElement.removeEventListener('loadeddata', loadedDataHandler);
    };

    // errorイベントのリスナーを追加
    const errorHandler = (error: Event) => {
      console.error('Video.js error:', error);
      this.videoElement.removeEventListener('error', errorHandler);
    };

    this.videoElement.addEventListener('loadeddata', loadedDataHandler);
    this.videoElement.addEventListener('error', errorHandler);

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
