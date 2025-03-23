// import { Ref, useEffect, useRef } from 'react';
// import invariant from 'tiny-invariant';
// import { assignRef } from 'use-callback-ref';

// import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
// import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

// interface Props {
//   className?: string;
//   loop?: boolean;
//   playerRef: Ref<PlayerWrapper | null>;
//   playerType: PlayerType;
//   playlistUrl: string;
// }

// export const Player = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
//   const mountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const mountElement = mountRef.current;
//     invariant(mountElement);

//     const abortController = new AbortController();
//     let player: PlayerWrapper | null = null;

//     void import('@wsh-2025/client/src/features/player/logics/create_player').then(({ createPlayer }) => {
//       if (abortController.signal.aborted) {
//         return;
//       }
//       player = createPlayer(playerType);
//       player.load(playlistUrl, { loop: loop ?? false });
//       mountElement.appendChild(player.videoElement);
//       assignRef(playerRef, player);
//     });

//     return () => {
//       abortController.abort();
//       if (player != null) {
//         mountElement.removeChild(player.videoElement);
//         player.destory();
//       }
//       assignRef(playerRef, null);
//     };
//   }, [playerType, playlistUrl, loop]);

//   return (
//     <div className={className}>
//       <div className="relative size-full">
//         <div ref={mountRef} className="size-full" />

//         <div className="absolute inset-0 z-[-10] grid place-content-center">
//           {/* <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff]" /> */}
//           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
//             <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
//               <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
//                 <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"/>
//                 <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
//               </path>
//               <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
//                 <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0"/>
//               </path>
//             </g>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

import { Ref, useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import { assignRef } from 'use-callback-ref';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

interface Props {
  className?: string;
  loop?: boolean;
  playerRef: Ref<PlayerWrapper | null>;
  playerType: PlayerType;
  playlistUrl: string;
}

export const Player = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    void import('@wsh-2025/client/src/features/player/logics/create_player').then(({ createPlayer }) => {
      if (abortController.signal.aborted) return;

      player = createPlayer(playerType);
      player.load(playlistUrl, { loop: loop ?? false });

      // すでに他の親にアタッチされている場合は、取り除いてから追加
      if (player.videoElement.parentNode && player.videoElement.parentNode !== mountElement) {
        player.videoElement.parentNode.removeChild(player.videoElement);
      }
      // まだ追加されていなければ追加
      if (mountElement.firstChild !== player.videoElement) {
        mountElement.appendChild(player.videoElement);
      }
      assignRef(playerRef, player);
    });

    return () => {
      abortController.abort();
      if (player != null) {
        // mountElement にアタッチされていれば削除
        if (player.videoElement.parentNode === mountElement) {
          mountElement.removeChild(player.videoElement);
        }
        // cleanup 用のメソッドが存在するかチェック
        if ('destroy' in player && typeof player.destroy === 'function') {
          player.destroy();
        } else if ('destory' in player && typeof player.destory === 'function') {
          player.destory();
        } else {
          // cleanup メソッドが存在しない場合は警告を出す（必要に応じて削除可）
          console.warn('Player cleanup method not found.');
        }
      }
      assignRef(playerRef, null);
    };
  }, [playerType, playlistUrl, loop]);

  return (
    <div className={className}>
      <div className="relative size-full">
        <div ref={mountRef} className="size-full" />

        <div className="absolute inset-0 z-[-10] grid place-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path strokeDasharray="16" strokeDashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
                <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
              </path>
              <path strokeDasharray="64" strokeDashoffset="64" strokeOpacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
              </path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
