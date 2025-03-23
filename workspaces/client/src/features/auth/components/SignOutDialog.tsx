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
        <div className="mb-4 flex w-full flex-row justify-center">
          <img className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
        </div>

        <h2 className="text-6 mb-6 text-center font-bold">ログアウト</h2>

        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitError }) => (
            <form className="mb-4" onSubmit={(ev) => void handleSubmit(ev)}>
              <div className="rounded-1 text-3.5 border-0.5 mb-6 flex w-full flex-row items-center justify-start border-solid border-[#DDAA00] bg-[#fffcee] p-2 font-bold text-[#DDAA00]">
                <div className="i-material-symbols:warning-outline-rounded m-1 size-5" />
                <span>プレミアムエピソードが視聴できなくなります。</span>
              </div>

              {submitError ? (
                <div className="rounded-1 text-3.5 border-0.5 mb-2 flex w-full flex-row items-center justify-start border-solid border-[#F0163A] bg-[#ffeeee] p-2 font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-1 size-5" />
                  <span>{submitError}</span>
                </div>
              ) : null}

              <div className="flex flex-row justify-center">
                <button
                  className="rounded-1 text-3.5 block flex w-40 flex-row items-center justify-center bg-[#1c43d1] p-3 font-bold text-white disabled:opacity-50"
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
