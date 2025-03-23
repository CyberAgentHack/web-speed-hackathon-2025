import '@videojs/http-streaming';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';
import { VhsConfig } from '@wsh-2025/client/src/features/player/logics/create_player';
import videojs from 'video.js';

export class VideoJSPlayerWrapper implements PlayerWrapper {
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
