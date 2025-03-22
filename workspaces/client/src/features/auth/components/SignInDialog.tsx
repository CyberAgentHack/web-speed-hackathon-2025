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

const _SignInDialog = ({ onClose, onOpenSignUp }: Omit<Props, 'isOpen'>) => {
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
    <div className="size-full">
      <div className="mb-[16px] flex w-full flex-row justify-center">
        <img className="object-contain" height={36} src="/public/arema.avif" width={98} />
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
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--fa-solid m-[4px] size-[20px] shrink-0 grow-0" width="0.88em" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4"></path></svg>
                <span>{submitError}</span>
              </div>
            ) : null}

            <div className="flex flex-row justify-center">
              <button
                className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                disabled={submitting || hasValidationErrors}
                type="submit"
                aria-label="ログイン"
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
          aria-label='アカウントを新規登録する'
        >
          アカウントを新規登録する
        </button>
      </div>
    </div>
  );
};

export const SignInDialog = ({ isOpen, onClose, onOpenSignUp }: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <_SignInDialog onClose={onClose} onOpenSignUp={onOpenSignUp} />
    </Dialog>
  )
}
