import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

export const createPlayer = async (playerType: PlayerType): Promise<PlayerWrapper> => {
  // switch (playerType) {
  //   case PlayerType.ShakaPlayer: {
  //     return new ShakaPlayerWrapper(playerType);
  //   }
  //   case PlayerType.HlsJS: {
  //     return new HlsJSPlayerWrapper(playerType);
  //   }
  //   case PlayerType.VideoJS: {
  //     return new VideoJSPlayerWrapper(playerType);
  //   }
  //   default: {
  //     playerType satisfies never;
  //     throw new Error('Invalid player type.');
  //   }
  // }

  switch (playerType) {
    case PlayerType.ShakaPlayer: {
      const { ShakaPlayerWrapper } = await import('@wsh-2025/client/src/features/player/logics/ShakaPlayer');
      return new ShakaPlayerWrapper(playerType);
    }
    case PlayerType.HlsJS: {
      const { HlsJSPlayerWrapper } = await import('@wsh-2025/client/src/features/player/logics/HlsPlayer');
      let player = new HlsJSPlayerWrapper(playerType);
      await player.initPlayer();
      return player;
    }
    case PlayerType.VideoJS: {
      const { VideoJSPlayerWrapper } = await import('@wsh-2025/client/src/features/player/logics/VideoJsPlayer');
      return new VideoJSPlayerWrapper(playerType);
    }
    default: {
      playerType satisfies never;
      throw new Error('Invalid player type.');
    }
  }
};
