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
        <div className="mb-[16px] flex w-full flex-row justify-center">
          <img className="object-contain" height={36} src="/public/arema.svg" width={98} />
        </div>

        <h2 className="mb-[24px] text-center text-[24px] font-bold">ログイン</h2>

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
            <form className="mb-[16px]" onSubmit={(ev) => void handleSubmit(ev)}>
              <Field name="email">
                {({ input, meta }) => {
                  return (
                    <div className="mb-[24px]">
                      <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
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
                        className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
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
                    <div className="mb-[24px]">
                      <div className="mb-[8px] flex flex-row items-center justify-between text-[14px] font-bold">
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
                        className="w-full rounded-[4px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF] p-[12px] text-[14px] text-[#212121] placeholder:text-[#999999]"
                        id={passwordId}
                        placeholder="パスワードを入力"
                        type="password"
                      />
                    </div>
                  );
                }}
              </Field>

              {submitError ? (
                <div className="mb-[8px] flex w-full flex-row items-center justify-start rounded-[4px] border-[2px] border-solid border-[#F0163A] bg-[#ffeeee] p-[8px] text-[14px] font-bold text-[#F0163A]">
                  <svg
                    className="m-[4px] size-[20px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" fill="currentColor" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              ) : null}

              <div className="flex flex-row justify-center">
                <button
                  className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
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
