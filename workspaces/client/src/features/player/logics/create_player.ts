import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';
// import { ShakaPlayerWrapper } from '@wsh-2025/client/src/features/player/logics/ShakaPlayerWrapper';
// import { VideoJSPlayerWrapper } from '@wsh-2025/client/src/features/player/logics/VideoJSPlayerWrapper';

export interface VhsConfig {
  GOAL_BUFFER_LENGTH: number;
  MAX_GOAL_BUFFER_LENGTH: number;
}

export const createPlayer = async (playerType: PlayerType): Promise<PlayerWrapper> => {
  switch (playerType) {
    case PlayerType.ShakaPlayer: {
      const { ShakaPlayerWrapper } = await import('./ShakaPlayerWrapper');
      return new ShakaPlayerWrapper(playerType);
    }
    case PlayerType.HlsJS: {
      const { HlsJSPlayerWrapper } = await import('./HlsJSPlayerWrapper');
      return new HlsJSPlayerWrapper();
    }
    case PlayerType.VideoJS: {
      const { VideoJSPlayerWrapper } = await import('./VideoJSPlayerWrapper');
      return new VideoJSPlayerWrapper(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
