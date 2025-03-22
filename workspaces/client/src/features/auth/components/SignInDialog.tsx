import { BetterFetchError } from '@better-fetch/fetch';
import { useId, useState } from 'react';
import { z } from 'zod';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { isValidEmail } from '@wsh-2025/client/src/features/auth/logics/isValidEmail';
import { isValidPassword } from '@wsh-2025/client/src/features/auth/logics/isValidPassword';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

const emailSchema = z
  .string({ required_error: 'メールアドレスを入力してください' })
  .and(z.custom(isValidEmail, { message: 'メールアドレスが正しくありません' }));
const passwordSchema = z
  .string({ required_error: 'パスワードを入力してください' })
  .and(z.custom(isValidPassword, { message: 'パスワードが正しくありません' }));

export const SignInDialog = ({ isOpen, onClose, onOpenSignUp }: Props) => {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-[16px] flex w-full flex-row justify-center">
          <img className="object-contain" height={36} src="/public/arema.svg" width={98} />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログイン</h2>

        <form
          action={async () => {
            setLoading(true);
            await authActions
              .signIn({
                email,
                password,
              })
              .then(() => {
                alert('ログインに成功しました');
                onClose();
              })
              .catch((e: unknown) => {
                if (e instanceof BetterFetchError && e.status === 401) {
                  setErrorMessage('アカウントが存在しないか入力した情報が間違っています');
                  return;
                }
                setErrorMessage('不明なエラーが発生しました');
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          className="mb-[16px]"
        >
          <div className="mb-[24px]">
            <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
              <label className="shrink-0 grow-0" htmlFor={emailId}>
                メールアドレス
              </label>
              {emailError && <span className="shrink-0 grow-0 text-[#F0163A]">{emailError}</span>}
            </div>
            <input
              required
              className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
              id={emailId}
              placeholder="メールアドレスを入力"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
                const validate = emailSchema.safeParse(e.target.value || undefined);
                if (!validate.success) {
                  setEmailError(validate.error.issues[0]?.message || '');
                } else {
                  setEmailError('');
                }
              }}
            />
          </div>

          <div className="mb-[24px]">
            <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
              <label className="shrink-0 grow-0" htmlFor={passwordId}>
                パスワード
              </label>
              {passwordError && <span className="shrink-0 grow-0 text-[#F0163A]">{passwordError}</span>}
            </div>
            <input
              required
              className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
              id={passwordId}
              placeholder="パスワードを入力"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                const validate = passwordSchema.safeParse(e.target.value || undefined);
                if (!validate.success) {
                  setPasswordError(validate.error.issues[0]?.message || '');
                } else {
                  setPasswordError('');
                }
              }}
            />
          </div>

          {errorMessage ? (
            <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
              <div className="i-material-symbols:error-outline m-[4px] size-[20px]" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="flex flex-row justify-center">
            <button
              className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
              disabled={!!errorMessage || !!emailError || !!passwordError || email === '' || password === '' || loading}
              type="submit"
            >
              ログイン
            </button>
          </div>
        </form>

        <div className="flex flex-row justify-center">
          <button
            className="block bg-transparent text-[14px] text-[#999999] underline"
            type="button"
            onClick={onOpenSignUp}
          >
            アカウントを新規登録する
          </button>
        </div>
      </div>
    </Dialog>
  );
};
