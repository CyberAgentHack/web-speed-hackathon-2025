import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export const SignUpPage = memo(function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuthActions();

  const onSubmit = useCallback(async (values: { email: string; password: string }) => {
    try {
      await signUp(values);
      alert('新規登録に成功しました');
      navigate('/'); // 登録後にホームなどへ移動
    } catch (e) {
      // 400などのエラー時
      return { [FORM_ERROR]: '入力情報が正しくありません' };
    }
  }, [signUp, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>会員登録</h2>
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

            <button type="submit" disabled={submitting}>アカウント作成</button>
          </form>
        )}
      />
    </div>
  );
});
