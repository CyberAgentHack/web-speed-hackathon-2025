import { useState } from 'react';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const _SignOutDialog = ({ onClose }: Omit<Props, 'isOpen'>) => {
  const authActions = useAuthActions();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await authActions.signOut();
      alert('ログアウトしました');
      onClose();
    } catch {
      setSubmitError('不明なエラーが発生しました');
    }
  };

  return (
    <div className="size-full">
      <div className="mb-[16px] flex w-full flex-row justify-center">
        <img className="object-contain" height={36} src="/public/arema.avif" width={98} />
      </div>

      <h2 className="mb-[24px] text-center text-[24px] font-bold">ログアウト</h2>

      <form className="mb-[16px]" onSubmit={handleSubmit}>
        <div className="mb-[24px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#DDAA00] bg-[#fffcee] p-[8px] text-[14px] font-bold text-[#DDAA00]">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--material-symbols m-[4px] size-[20px]" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zm1.725-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15m0-2.5"></path></svg>
          <span>プレミアムエピソードが視聴できなくなります。</span>
        </div>

        {submitError && (
          <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--fa-solid m-[4px] size-[20px] shrink-0 grow-0" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4"></path></svg>
            <span>{submitError}</span>
          </div>
        )}

        <div className="flex flex-row justify-center">
          <button
            className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
            type="submit"
            aria-label='ログアウト'
          >
            ログアウト
          </button>
        </div>
      </form>
    </div>
  );
};

export const SignOutDialog = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <_SignOutDialog onClose={onClose} />
    </Dialog>
  );
}
