import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement } from 'react';
import { Link } from 'react-router';
import { ArrayValues } from 'type-fest';

import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { useEpisode } from '@wsh-2025/client/src/pages/timetable/hooks/useEpisode';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  isOpen: boolean;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const ProgramDetailDialog = ({ isOpen, program }: Props): ReactElement => {
  const episode = useEpisode(program.episodeId);
  const [, setProgram] = useSelectedProgramId();

  const onClose = () => {
    setProgram(null);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div style={{ height: '75vh', width: '100%', overflow: 'auto' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>番組詳細</h2>

        <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{program.title}</p>
        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#999999' }}>
          <div
            style={{ display: '-webkit-box', WebkitLineClamp: '5', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {program.description}
          </div>
        </div>
        <img
          alt=""
          style={{
            marginBottom: '24px',
            width: '100%',
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.12)',
          }}
          src={program.thumbnailUrl}
          loading="lazy"
        />

        {episode != null ? (
          <>
            <h3 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              番組で放送するエピソード
            </h3>

            <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>
              {episode.title}
            </p>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: '#999999' }}>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: '5',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {episode.description}
              </div>
            </div>
            <img
              alt=""
              style={{
                marginBottom: '24px',
                width: '100%',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.12)',
              }}
              src={episode.thumbnailUrl}
              loading="lazy"
            />
          </>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Link
            style={{
              width: '160px',
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: '#1c43d1',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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
