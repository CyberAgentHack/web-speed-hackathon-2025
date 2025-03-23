import HlsJs from 'hls.js';

import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

class HlsJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: false,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player = new HlsJs({
    enableWorker: false,
    maxBufferLength: 50,
  });
  private _observer: IntersectionObserver | null = null;

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
    
    // IntersectionObserverの設定
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void this.videoElement.play();
          } else {
            this.videoElement.pause();
          }
        });
      },
      { threshold: 0.1 } // 10%以上がビューポート内に入ったら再生
    );
    
    // 動画要素がDOMに追加されるまで待つ
    setTimeout(() => {
      if (this._observer) {
        this._observer.observe(this.videoElement);
      }
    }, 0);
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
    if (this._observer) {
      this._observer.unobserve(this.videoElement);
      this._observer.disconnect();
      this._observer = null;
    }
    this._player.destroy();
  }
}

export const createPlayer = (): PlayerWrapper => {
  // 常にHlsJSを使用
  return new HlsJSPlayerWrapper();
};
