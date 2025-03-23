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
  onOpenSignIn: () => void;
}

const formSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください' })
    .and(z.custom(isValidEmail, { message: 'メールアドレスが正しくありません' })),
  password: z
    .string({ required_error: 'パスワードを入力してください' })
    .and(z.custom(isValidPassword, { message: 'パスワードが正しくありません' })),
});

const _SignUpDialog = ({ onClose, onOpenSignIn }: Omit<Props, 'isOpen'>) => {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: 'email' | 'password', value: string) => {
    if (!value) {
      return name === 'email' ? 'メールアドレスを入力してください' : 'パスワードを入力してください';
    }
    const result = formSchema.shape[name].safeParse(value);
    if (!result.success && result.error.errors.length > 0) {
      const firstError = result.error.errors[0];
      if (firstError && firstError.message) {
        return Array.isArray(firstError.message) ? firstError.message[0] : firstError.message;
      }
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailTouched) {
      setEmailError(validateField('email', newEmail));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (passwordTouched) {
      setPasswordError(validateField('password', newPassword));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateField('email', email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validateField('password', password));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const emailValidation = validateField('email', email);
    const passwordValidation = validateField('password', password);
    
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    
    if (emailValidation || passwordValidation) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await authActions.signUp({
        email,
        password,
      });

      alert('新規会員登録に成功しました');
      onClose();
    } catch (e) {
      if (e instanceof BetterFetchError && e.status === 400) {
        setSubmitError('入力した情報が正しくありません');
      } else {
        setSubmitError('不明なエラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="size-full">
      <div className="mb-[16px] flex w-full flex-row justify-center">
        <img className="object-contain" height={36} src="/public/arema.avif" width={98} />
      </div>

      <h2 className="mb-[24px] text-center text-[24px] font-bold">会員登録</h2>

      <form className="mb-[16px]" onSubmit={handleSubmit}>
        <div className="mb-[24px]">
          <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
            <label className="shrink-0 grow-0" htmlFor={emailId}>
              メールアドレス
            </label>
            {emailTouched && emailError && (
              <span className="shrink-0 grow-0 text-[#F0163A]">{emailError}</span>
            )}
          </div>
          <input
            required
            className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
            id={emailId}
            placeholder="メールアドレスを入力"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
          />
        </div>

        <div className="mb-[24px]">
          <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
            <label className="shrink-0 grow-0" htmlFor={passwordId}>
              パスワード
            </label>
            {passwordTouched && passwordError && (
              <span className="shrink-0 grow-0 text-[#F0163A]">{passwordError}</span>
            )}
          </div>
          <input
            required
            className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
            id={passwordId}
            placeholder="パスワードを入力"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
          />
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
            disabled={isSubmitting || Boolean(emailError) || Boolean(passwordError)}
            type="submit"
            aria-label='アカウント作成'
          >
            アカウント作成
          </button>
        </div>
      </form>

      <div className="flex flex-row justify-center">
        <button
          className="block bg-transparent text-[14px] text-[#999999] underline"
          type="button"
          onClick={onOpenSignIn}
          aria-label='既にあるアカウントにログインする'
        >
          既にあるアカウントにログインする
        </button>
      </div>
    </div>
  );
};

export const SignUpDialog = ({ isOpen, onClose, onOpenSignIn }: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <_SignUpDialog onClose={onClose} onOpenSignIn={onOpenSignIn} />
    </Dialog>
  );
}
