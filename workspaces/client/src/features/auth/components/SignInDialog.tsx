import { BetterFetchError } from '@better-fetch/fetch';
import { FORM_ERROR } from 'final-form';
import { useId } from 'react';
import { Field, Form } from 'react-final-form';
import { z } from 'zod';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { isValidEmail } from '@wsh-2025/client/src/features/auth/logics/isValidEmail';
import { isValidPassword } from '@wsh-2025/client/src/features/auth/logics/isValidPassword';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';

interface SignInFormValues {
  email: string;
  password: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const SignInDialog = ({ isOpen, onClose, onOpenSignUp }: Props) => {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await authActions.signIn({
        email: values.email,
        password: values.password,
      });

      alert('ログインに成功しました');
      onClose();
      return;
    } catch (e) {
      if (e instanceof BetterFetchError && e.status === 401) {
        return { [FORM_ERROR]: 'アカウントが存在しないか入力した情報が間違っています' };
      }
      return { [FORM_ERROR]: '不明なエラーが発生しました' };
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-4 flex w-full flex-row justify-center">
          <img className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
        </div>

        <h2 className="text-6 mb-6 text-center font-bold">ログイン</h2>

        <Form
          validate={(values) => {
            const schema = z.object({
              email: z
                .string({ required_error: 'メールアドレスを入力してください' })
                .and(z.custom(isValidEmail, { message: 'メールアドレスが正しくありません' })),
              password: z
                .string({ required_error: 'パスワードを入力してください' })
                .and(z.custom(isValidPassword, { message: 'パスワードが正しくありません' })),
            });
            const result = schema.safeParse(values);
            return result.success ? undefined : result.error.formErrors.fieldErrors;
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, hasValidationErrors, submitError, submitting }) => (
            <form className="mb-4" onSubmit={(ev) => void handleSubmit(ev)}>
              <Field name="email">
                {({ input, meta }) => {
                  return (
                    <div className="mb-6">
                      <div className="text-3.5 mb-2 flex flex-row items-center justify-between font-bold">
                        <label className="shrink-0 grow-0" htmlFor={emailId}>
                          メールアドレス
                        </label>
                        {meta.modified && Array.isArray(meta.error) ? (
                          <span className="shrink-0 grow-0 text-[#F0163A]">{meta.error[0]}</span>
                        ) : null}
                      </div>
                      <input
                        {...input}
                        required
                        className="rounded-1 text-3.5 border-0.5 w-full border-solid border-[#FFFFFF1F] bg-white p-3 text-[#212121] placeholder:text-[#999999]"
                        id={emailId}
                        placeholder="メールアドレスを入力"
                        type="email"
                      />
                    </div>
                  );
                }}
              </Field>

              <Field name="password">
                {({ input, meta }) => {
                  return (
                    <div className="mb-6">
                      <div className="text-3.5 mb-2 flex flex-row items-center justify-between font-bold">
                        <label className="shrink-0 grow-0" htmlFor={passwordId}>
                          パスワード
                        </label>
                        {meta.modified && Array.isArray(meta.error) ? (
                          <span className="shrink-0 grow-0 text-[#F0163A]">{meta.error[0]}</span>
                        ) : null}
                      </div>
                      <input
                        {...input}
                        required
                        className="rounded-1 text-3.5 border-0.5 w-full border-solid border-[#FFFFFF1F] bg-white p-3 text-[#212121] placeholder:text-[#999999]"
                        id={passwordId}
                        placeholder="パスワードを入力"
                        type="password"
                      />
                    </div>
                  );
                }}
              </Field>

              {submitError ? (
                <div className="rounded-1 text-3.5 border-0.5 mb-2 flex w-full flex-row items-center justify-start border-solid border-[#F0163A] bg-[#ffeeee] p-2 font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-1 size-5" />
                  <span>{submitError}</span>
                </div>
              ) : null}

              <div className="flex flex-row justify-center">
                <button
                  className="rounded-1 text-3.5 block flex w-40 flex-row items-center justify-center bg-[#1c43d1] p-3 font-bold text-white disabled:opacity-50"
                  disabled={submitting || hasValidationErrors}
                  type="submit"
                >
                  ログイン
                </button>
              </div>
            </form>
          )}
        </Form>

        <div className="flex flex-row justify-center">
          <button
            className="text-3.5 block bg-transparent text-[#999999] underline"
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
