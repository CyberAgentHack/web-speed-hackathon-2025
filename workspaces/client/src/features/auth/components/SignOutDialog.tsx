import { FORM_ERROR } from 'final-form';
import { Form } from 'react-final-form';
import { memo, useCallback } from 'react';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { Dialog } from '@/features/dialog/components/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SignOutDialog = memo(function SignOutDialog({ isOpen, onClose }: Props) {
  const authActions = useAuthActions();

  const onSubmit = useCallback(async () => {
    try {
      await authActions.signOut();
      alert('ログアウトしました');
      onClose();
    } catch {
      return { [FORM_ERROR]: '不明なエラーが発生しました' };
    }
  }, [authActions, onClose]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-[16px] flex w-full justify-center">
          <img
            alt="AremaTVロゴ"
            className="object-contain"
            height={36}
            src="/public/arema.svg"
            width={98}
            loading="lazy"
          />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログアウト</h2>

        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitError, submitting }) => (
            <form className="mb-[16px]" onSubmit={handleSubmit}>
              <div className="mb-[24px] flex items-center rounded-[4px] border-[2px] border-[#DDAA00] bg-[#fffcee] p-[8px] text-[14px] font-bold text-[#DDAA00]">
                <div className="i-material-symbols:warning-outline-rounded m-[4px] size-[20px]" />
                <span>プレミアムエピソードが視聴できなくなります。</span>
              </div>

              {submitError && (
                <div className="mb-[8px] flex w-full items-center rounded-[4px] border-[2px] border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-[4px] size-[20px]" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="block w-[160px] rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
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
});
