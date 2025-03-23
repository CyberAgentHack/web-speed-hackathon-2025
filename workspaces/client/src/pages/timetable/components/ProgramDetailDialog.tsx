import { type ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '../../../features/dialog/components/Dialog';
import { OptimizedImage } from '../../../features/image/components/OptimizedImage';
import { AspectRatio } from '../../../features/layout/components/AspectRatio';
import { useEpisode } from '../hooks/useEpisode';
import { useSelectedProgramId } from '../hooks/useSelectedProgramId';

interface Props {
  isOpen: boolean;
  program: {
    description: string;
    episodeId: string | null;
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const ProgramDetailDialog = ({ isOpen, program }: Props): ReactElement => {
  const episode = useEpisode(program.episodeId);
  const [, setProgram] = useSelectedProgramId();
  const [showProgramImage, setShowProgramImage] = useState(false);
  const [showEpisodeImage, setShowEpisodeImage] = useState(false);

  const onClose = () => {
    setProgram(null);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="h-75vh size-full overflow-auto">
        <h2 className="mb-[24px] text-center text-[24px] font-bold">番組詳細</h2>

        <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{program.title}</p>
        <div className="mb-[16px] text-[14px] text-[#999999]">
          <div className="line-clamp-5">{program.description}</div>
        </div>
        <AspectRatio 
          ratioHeight={9} 
          ratioWidth={16}
          onInView={() => {
            setShowProgramImage(true);
          }}
        >
          <div className="relative size-full">
            {showProgramImage && (
              <OptimizedImage
                alt={program.title}
                className="h-auto w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                height={720}
                priority={false}
                src={program.thumbnailUrl}
                width={1280}
              />
            )}
          </div>
        </AspectRatio>

        {episode != null ? (
          <>
            <h3 className="mt-[24px] mb-[24px] text-center text-[24px] font-bold">番組で放送するエピソード</h3>

            <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{episode.title}</p>
            <div className="mb-[16px] text-[14px] text-[#999999]">
              <div className="line-clamp-5">{episode.description}</div>
            </div>
            <AspectRatio 
              ratioHeight={9} 
              ratioWidth={16}
              onInView={() => {
                setShowEpisodeImage(true);
              }}
            >
              <div className="relative size-full">
                {showEpisodeImage && (
                  <OptimizedImage
                    alt={episode.title}
                    className="w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                    height={720}
                    src={episode.thumbnailUrl}
                    width={1280}
                  />
                )}
              </div>
            </AspectRatio>
          </>
        ) : null}

        <div className="mt-[24px] flex flex-row justify-center">
          <Link
            className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
            to={`/programs/${program.id}`}
            onClick={onClose}
          >
            番組をみる
          </Link>
        </div>
      </div>
    </Dialog>
  );
};
