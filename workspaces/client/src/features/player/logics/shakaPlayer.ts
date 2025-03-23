import shaka from 'shaka-player';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

export class ShakaPlayerWrapper implements PlayerWrapper {
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

export const createShakaPlayer = (playerType: PlayerType.ShakaPlayer): PlayerWrapper => {
  return new ShakaPlayerWrapper(playerType);
};
