import HlsJs from 'hls.js';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

type HlsPlayerOptions = {
  loop: boolean;
};

export class HlsJSPlayerWrapper implements PlayerWrapper {
  // <video>要素を作成
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: true,
    controls: false,
    muted: true,
    volume: 0.25,
  });

  // Hlsインスタンス
  private readonly hls = new HlsJs({
    enableWorker: false,
    maxBufferLength: 50,
  });
  
  // もし「プレイヤー種別」を持ちたい場合は保持する
  readonly playerType = PlayerType.HlsJS;

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

  load(playlistUrl: string, options: HlsPlayerOptions): void {
    // HLS.jsでロード開始
    this.hls.attachMedia(this.videoElement);
    this.videoElement.loop = options.loop;
    this.hls.loadSource(playlistUrl);
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
    this.hls.destroy();
  }
}

/**
 * 単一の HlsJS プレイヤーを生成するファクトリ
 */
export const createPlayer = (): PlayerWrapper => {
  return new HlsJSPlayerWrapper();
};