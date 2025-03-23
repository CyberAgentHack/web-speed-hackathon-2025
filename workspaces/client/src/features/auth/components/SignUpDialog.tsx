import { BetterFetchError } from '@better-fetch/fetch';
import { FORM_ERROR } from 'final-form';
import { useId, memo, useMemo, useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { z } from 'zod';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { isValidEmail } from '@/features/auth/logics/isValidEmail';
import { isValidPassword } from '@/features/auth/logics/isValidPassword';
import { Dialog } from '@/features/dialog/components/Dialog';

interface SignUpFormValues {
  email: string;
  password: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

// バリデーションスキーマはコンポーネント外で一度だけ定義
const signUpSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください' })
    .refine(isValidEmail, { message: 'メールアドレスが正しくありません' }),
  password: z
    .string({ required_error: 'パスワードを入力してください' })
    .refine(isValidPassword, { message: 'パスワードが正しくありません' })
});

export const SignUpDialog = memo(function SignUpDialog({
  isOpen,
  onClose,
  onOpenSignIn,
}: Props) {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  // validate 関数を useMemo でメモ化
  const validate = useMemo(() => {
    return (values: SignUpFormValues) => {
      const result = signUpSchema.safeParse(values);
      return result.success ? undefined : result.error.formErrors.fieldErrors;
    };
  }, []);

  // onSubmit を useCallback でメモ化
  const onSubmit = useCallback(async (values: SignUpFormValues) => {
    try {
      await authActions.signUp({ email: values.email, password: values.password });
      alert('新規会員登録に成功しました');
      onClose();
    } catch (e) {
      if (e instanceof BetterFetchError && e.status === 400) {
        return { [FORM_ERROR]: '入力した情報が正しくありません' };
      }
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

        <h2 className="mb-[24px] text-center text-[24px] font-bold">会員登録</h2>

        <Form onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit, hasValidationErrors, submitError, submitting }) => (
            <form className="mb-[16px]" onSubmit={handleSubmit}>
              <Field name="email">
                {({ input, meta }) => (
                  <div className="mb-[24px]">
                    <div className="mb-[8px] flex items-center justify-between text-[14px] font-bold">
                      <label htmlFor={emailId}>メールアドレス</label>
                      {meta.modified && meta.error && (
                        <span className="text-[#F0163A]">
                          {Array.isArray(meta.error) ? meta.error[0] : meta.error}
                        </span>
                      )}
                    </div>
                    <input
                      {...input}
                      id={emailId}
                      type="email"
                      required
                      placeholder="メールアドレスを入力"
                      className="w-full rounded-[4px] border-[2px] border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121]"
                    />
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ input, meta }) => (
                  <div className="mb-[24px]">
                    <div className="mb-[8px] flex items-center justify-between text-[14px] font-bold">
                      <label htmlFor={passwordId}>パスワード</label>
                      {meta.modified && meta.error && (
                        <span className="text-[#F0163A]">
                          {Array.isArray(meta.error) ? meta.error[0] : meta.error}
                        </span>
                      )}
                    </div>
                    <input
                      {...input}
                      id={passwordId}
                      type="password"
                      required
                      placeholder="パスワードを入力"
                      className="w-full rounded-[4px] border-[2px] border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121]"
                    />
                  </div>
                )}
              </Field>

              {submitError && (
                <div className="mb-[8px] flex w-full items-center rounded-[4px] border-[2px] border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-[4px] size-[20px]" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting || hasValidationErrors}
                  className="block w-[160px] rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                >
                  アカウント作成
                </button>
              </div>
            </form>
          )}
        </Form>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="bg-transparent text-[14px] text-[#999999] underline"
          >
            既にあるアカウントにログインする
          </button>
        </div>
      </div>
    </Dialog>
  );
});
