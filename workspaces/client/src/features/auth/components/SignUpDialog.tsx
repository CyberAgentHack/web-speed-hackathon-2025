import { BetterFetchError } from '@better-fetch/fetch';
import { useId, useState } from 'react';
import { z } from 'zod';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { isValidEmail } from '@wsh-2025/client/src/features/auth/logics/isValidEmail';
import { isValidPassword } from '@wsh-2025/client/src/features/auth/logics/isValidPassword';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';

interface SignUpFormValues {
  email: string;
  password: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

const schema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください' })
    .and(z.custom(isValidEmail, { message: 'メールアドレスが正しくありません' })),
  password: z
    .string({ required_error: 'パスワードを入力してください' })
    .and(z.custom(isValidPassword, { message: 'パスワードが正しくありません' })),
});

export const SignUpDialog = ({ isOpen, onClose, onOpenSignIn }: Props) => {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  const [formValues, setFormValues] = useState<SignUpFormValues>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof SignUpFormValues, value: string) => {
    const result = schema.safeParse({ ...formValues, [name]: value });
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors[name];
      setFormErrors(prev => ({ ...prev, [name]: fieldErrors }));
      return fieldErrors?.[0];
    }
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = schema.safeParse(formValues);
    if (!result.success) {
      setFormErrors(result.error.formErrors.fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await authActions.signUp({
        email: formValues.email,
        password: formValues.password,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof SignUpFormValues, value);
  };

  const hasValidationErrors = Object.values(formErrors).some(error => error !== undefined);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-[16px] flex w-full flex-row items-center justify-center">
          <OptimizedImage
            alt="AREMA"
            className="object-contain"
            height={36}
            priority
            src="/public/arema.svg"
            width={98}
          />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">会員登録</h2>

        <form className="mb-[16px]" onSubmit={handleSubmit}>
          <div className="mb-[24px]">
            <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
              <label className="shrink-0 grow-0" htmlFor={emailId}>
                メールアドレス
              </label>
              {formErrors.email && (
                <span className="shrink-0 grow-0 text-[#F0163A]">{formErrors.email[0]}</span>
              )}
            </div>
            <input
              required
              className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
              id={emailId}
              name="email"
              placeholder="メールアドレスを入力"
              type="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-[24px]">
            <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
              <label className="shrink-0 grow-0" htmlFor={passwordId}>
                パスワード
              </label>
              {formErrors.password && (
                <span className="shrink-0 grow-0 text-[#F0163A]">{formErrors.password[0]}</span>
              )}
            </div>
            <input
              required
              className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
              id={passwordId}
              name="password"
              placeholder="パスワードを入力"
              type="password"
              value={formValues.password}
              onChange={handleChange}
            />
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
              disabled={isSubmitting || hasValidationErrors}
              type="submit"
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
          >
            既にあるアカウントにログインする
          </button>
        </div>
      </div>
    </Dialog>
  );
};
