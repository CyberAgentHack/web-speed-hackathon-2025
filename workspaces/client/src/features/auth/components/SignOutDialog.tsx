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
          <img className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログアウト</h2>

        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitError }) => (
            <form className="mb-[16px]" onSubmit={(ev) => void handleSubmit(ev)}>
              <div className="mb-[24px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#DDAA00] bg-[#fffcee] p-[8px] text-[14px] font-bold text-[#DDAA00]">
                <div className="i-material-symbols:warning-outline-rounded m-[4px] size-[20px]" />
                <span>プレミアムエピソードが視聴できなくなります。</span>
              </div>

              {submitError ? (
                <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-[4px] size-[20px]" />
                  <span>{submitError}</span>
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
