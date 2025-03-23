import HlsJs from 'hls.js';

import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

class HlsJSPlayerWrapper implements PlayerWrapper {
  readonly videoElement = Object.assign(document.createElement('video'), {
    autoplay: false,
    controls: false,
    muted: true,
    volume: 0.25,
  });
  private _player: HlsJs | null = null;
  private _observer: IntersectionObserver | null = null;
  private _isPreview = false;

  get currentTime(): number {
    const currentTime = this.videoElement.currentTime;
    return Number.isNaN(currentTime) ? 0 : currentTime;
  }
  get paused(): boolean {
    return this.videoElement.paused;
  }
  get duration(): number {
    const duration = this._player?.media?.duration ?? 0;
    return Number.isNaN(duration) ? 0 : duration;
  }
  get muted(): boolean {
    return this.videoElement.muted;
  }

  load(playlistUrl: string, options: { loop: boolean }): void {
    // Check if this is likely a preview (from JumbotronSection)
    this._isPreview = playlistUrl.includes('/episode/') && options.loop === true;
    
    // Create HLS player with appropriate buffer settings
    this._player = new HlsJs({
      enableWorker: false,
      // Use smaller buffer for previews
      maxBufferLength: this._isPreview ? 10 : 30,
      maxMaxBufferLength: this._isPreview ? 10 : 30,
      // Limit backbuffer for previews
      backBufferLength: this._isPreview ? 5 : 10,
    });
    
    this._player.attachMedia(this.videoElement);
    this.videoElement.loop = options.loop;
    
    // For previews, stop loading after initial segments
    if (this._isPreview) {
      this._player.on(HlsJs.Events.FRAG_LOADED, () => {
        if (this._player && this.videoElement.buffered.length > 0 && 
            this.videoElement.buffered.end(0) > 10) {
          // Stop loading more fragments after we have 10 seconds
          this._player.stopLoad();
        }
      });
    }
    
    this._player.loadSource(playlistUrl);
    
    // IntersectionObserverの設定
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void this.videoElement.play();
          } else {
            this.videoElement.pause();
            
            // For previews, also stop loading when out of view
            if (this._isPreview && this._player) {
              this._player.stopLoad();
            }
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
    if (this._player) {
      this._player.stopLoad();
      this._player.destroy();
      this._player = null;
    }
  }
}

export const createPlayer = (): PlayerWrapper => {
  return new HlsJSPlayerWrapper();
};
