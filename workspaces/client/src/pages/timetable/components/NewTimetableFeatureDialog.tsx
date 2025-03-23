import FeatureExplainImageUrl from '@wsh-2025/client/assets/timetable/feature-explain.png';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { useCloseNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useCloseNewFeatureDialog';

interface Props {
  isOpen: boolean;
}

export const NewTimetableFeatureDialog = ({ isOpen }: Props) => {
  const onClose = useCloseNewFeatureDialog();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <img style={{ objectFit: 'contain' }} height={36} src="/public/arema.svg" width={98} loading="lazy" />
        </div>

        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          拡大・縮小機能を新しく追加
        </h2>

        <p style={{ marginBottom: '4px', fontSize: '14px', color: '#999999' }}>
          いつもAREMAをご利用いただきありがとうございます。この度、番組表の機能をさらに使いやすくするための新しい機能を追加しました。
        </p>
        <p style={{ marginBottom: '4px', fontSize: '14px', color: '#999999' }}>
          番組表にあるそれぞれの番組タイトルをクリック &
          ドラッグすることで、簡単に拡大・縮小が可能になりました。この機能を利用すると、表示幅が狭くて途切れていたタイトルや詳細情報も全て確認することができるようになります！
        </p>
        <p style={{ marginBottom: '24px', fontSize: '14px', color: '#999999' }}>
          引き続き皆様に快適にご利用いただけるよう、サービスの改善に努めてまいります。今後ともどうぞよろしくお願いいたします。
        </p>

        <img alt="" style={{ marginBottom: '24px', width: '100%' }} src={FeatureExplainImageUrl} loading="lazy" />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button
            style={{
              width: '160px',
              padding: '12px',
              backgroundColor: '#1c43d1',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            type="button"
            onClick={onClose}
          >
            試してみる
          </button>
        </div>
      </div>
    </Dialog>
  );
};
