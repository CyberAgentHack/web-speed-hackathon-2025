import { FORM_ERROR } from 'final-form';
import { Form } from 'react-final-form';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SignOutDialog = ({ isOpen, onClose }: Props) => {
  const authActions = useAuthActions();

  const onSubmit = async () => {
    try {
      await authActions.signOut();

      alert('ログアウトしました');
      onClose();
      return;
    } catch {
      return { [FORM_ERROR]: '不明なエラーが発生しました' };
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-[16px] flex w-full flex-row justify-center">
          <img className="object-contain" height={36} src="/public/arema.svg" width={98} />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログアウト</h2>

        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitError }) => (
            <form className="mb-[16px]" onSubmit={(ev) => void handleSubmit(ev)}>
              <div className="mb-[24px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#DDAA00] bg-[#fffcee] p-[8px] text-[14px] font-bold text-[#DDAA00]">
                <svg className="m-[4px] size-[20px]" height={20}  viewBox="0 0 24 24" width={20} xmlns="http://www.w3.org/2000/svg"><path d="M20 20h-4.05q-.425 0-.712-.288T14.95 19t.288-.712t.712-.288H20v-4q0-.425.288-.712T21 13t.713.288T22 14v4q0 .825-.587 1.413T20 20M3 7.15q-.425 0-.712-.288T2 6.15V6q0-.825.588-1.412T4 4h6q.425 0 .713.288T11 5t-.288.713T10 6H4v.15q0 .425-.288.713T3 7.15M18 11q-2.075 0-3.537-1.463T13 6t1.463-3.537T18 1t3.538 1.463T23 6t-1.463 3.538T18 11m0-2q.2 0 .35-.15t.15-.35t-.15-.35T18 8t-.35.15t-.15.35t.15.35T18 9m0-2q.2 0 .35-.15t.15-.35v-3q0-.2-.15-.35T18 3t-.35.15t-.15.35v3q0 .2.15.35T18 7M3.5 20q-.625 0-1.062-.437T2 18.5t.438-1.062T3.5 17t1.063.438T5 18.5t-.437 1.063T3.5 20M8 20q-.4 0-.7-.238t-.375-.637Q6.65 17.55 5.513 16.45T2.8 15.075q-.375-.05-.587-.362T2 14q0-.425.263-.712t.637-.238q2.35.3 4.025 1.975t2 4.025q.05.4-.225.675T8 20m4 0q-.425 0-.712-.275t-.338-.7q-.35-3.2-2.612-5.425t-5.463-2.55q-.4-.05-.638-.35T2 10q0-.425.263-.725t.637-.25q4.025.325 6.85 3.138t3.2 6.812q.05.425-.237.725T12 20" fill="currentColor"/></svg>
                <span>プレミアムエピソードが視聴できなくなります。</span>
              </div>

              {submitError ? (
                <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
<svg className="m-[4px] size-[20px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                      fill="currentColor"
                    />
                  </svg>                  <span>{submitError}</span>
                </div>
              ) : null}

              <div className="flex flex-row justify-center">
                <button
                  className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                  type="submit"
                >
                  ログアウト
                </button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </Dialog>
  );
};
