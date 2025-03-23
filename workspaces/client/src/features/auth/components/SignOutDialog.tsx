import { type FormEvent, useState } from 'react';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SignOutDialog = ({ isOpen, onClose }: Props) => {
  const authActions = useAuthActions();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await authActions.signOut();
      alert('ログアウトしました');
      onClose();
    } catch {
      setSubmitError('不明なエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-[16px] flex w-full flex-row items-center justify-center">
          <OptimizedImage
            priority
            alt="AREMA"
            className="object-contain"
            height={36}
            src="/public/arema.svg"
            width={98}
          />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログアウト</h2>

        <form className="mb-[16px]" onSubmit={(e) => void handleSubmit(e)}>
          <div className="mb-[24px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0A116] bg-[#fff8ee] p-[8px] text-[14px] font-bold text-[#F0A116]">
            <div className="i-material-symbols:warning-outline-rounded m-[4px] size-[20px] bg-current" />
            <span>プレミアムエピソードが視聴できなくなります。</span>
          </div>

          {submitError && (
            <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
              <div className="i-material-symbols:error-outline m-[4px] size-[20px] bg-current" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex flex-row justify-center">
            <button
              className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              ログアウト
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
