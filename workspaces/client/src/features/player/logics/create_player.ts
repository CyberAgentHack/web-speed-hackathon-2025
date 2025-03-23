import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

export const createPlayer = async (playerType: PlayerType): Promise<PlayerWrapper> => {
  switch (playerType) {
    case PlayerType.ShakaPlayer: {
      const { createShakaPlayer } = await import('./shakaPlayer');
      return createShakaPlayer(playerType);
    }
    case PlayerType.HlsJS: {
      const { createHlsJsPlayer } = await import('./hlsJsPlayer');
      return createHlsJsPlayer(playerType);
    }
    case PlayerType.VideoJS: {
      const { createVideoJsPlayer } = await import('./videoJsPlayer');
      return createVideoJsPlayer(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
