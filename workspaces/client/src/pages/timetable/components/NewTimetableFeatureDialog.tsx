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
      <div className="size-full">
        <div className="mb-4 flex w-full flex-row justify-center">
          <img className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
        </div>

        <h2 className="text-6 mb-6 text-center font-bold">拡大・縮小機能を新しく追加</h2>

        <p className="text-3.5 mb-1 text-[#999999]">
          いつもAREMAをご利用いただきありがとうございます。この度、番組表の機能をさらに使いやすくするための新しい機能を追加しました。
        </p>
        <p className="text-3.5 mb-1 text-[#999999]">
          番組表にあるそれぞれの番組タイトルをクリック &
          ドラッグすることで、簡単に拡大・縮小が可能になりました。この機能を利用すると、表示幅が狭くて途切れていたタイトルや詳細情報も全て確認することができるようになります！
        </p>
        <p className="text-3.5 mb-6 text-[#999999]">
          引き続き皆様に快適にご利用いただけるよう、サービスの改善に努めてまいります。今後ともどうぞよろしくお願いいたします。
        </p>

        <img alt="" className="mb-6 w-full" loading="lazy" src={FeatureExplainImageUrl} />

        <div className="flex flex-row justify-center">
          <button
            className="rounded-1 text-3.5 block flex w-40 flex-row items-center justify-center bg-[#1c43d1] p-3 font-bold text-white disabled:opacity-50"
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
