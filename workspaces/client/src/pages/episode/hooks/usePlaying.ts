import { useCallback } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const playing = useStore((s) => s.pages.episode.playing);
  const play = useStore((s) => s.pages.episode.play);
  const pause = useStore((s) => s.pages.episode.pause);

  const toggle = useCallback((): void => {
    if (playing) {
      pause();
    } else {
      play();
    }
  }, [playing, play, pause]);

  return [playing, toggle] as const;
}
