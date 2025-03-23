import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
// 例: useAuthActions 内で signIn() がサーバーへリクエストを飛ばしている

export const SignInPage = memo(function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();

  const onSubmit = useCallback(async (values: { email: string; password: string }) => {
    try {
      await signIn(values);
      alert('ログインに成功しました');
      navigate('/'); // ログイン後はホームなど好きな場所へリダイレクト
    } catch (e) {
      // 401などのエラー時はここでエラーメッセージを返す
      return { [FORM_ERROR]: 'アカウントが存在しないか、情報が間違っています' };
    }
  }, [signIn, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>ログイン</h2>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, submitError }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>メールアドレス</label>
              <Field name="email" component="input" type="email" required />
            </div>
            <div>
              <label>パスワード</label>
              <Field name="password" component="input" type="password" required />
            </div>

            {submitError && (
              <div style={{ color: 'red', margin: '8px 0' }}>
                {submitError}
              </div>
            )}

            <button type="submit" disabled={submitting}>ログイン</button>
          </form>
        )}
      />
    </div>
  );
});
