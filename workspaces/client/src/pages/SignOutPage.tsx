import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export const SignOutPage = memo(function SignOutPage() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const onSubmit = useCallback(async () => {
    try {
      await signOut();
      alert('ログアウトしました');
      navigate('/');
    } catch {
      return { [FORM_ERROR]: '不明なエラーが発生しました' };
    }
  }, [signOut, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>ログアウト</h2>
      <p>プレミアムエピソードが視聴できなくなります。よろしいですか？</p>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, submitError }) => (
          <form onSubmit={handleSubmit}>
            {submitError && (
              <div style={{ color: 'red', margin: '8px 0' }}>
                {submitError}
              </div>
            )}
            <button type="submit" disabled={submitting}>ログアウト</button>
          </form>
        )}
      />
    </div>
  );
});
