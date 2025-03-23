import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigationType } from 'react-router-dom';

import { SignInDialog } from '@wsh-2025/client/src/features/auth/components/SignInDialog';
import { SignOutDialog } from '@wsh-2025/client/src/features/auth/components/SignOutDialog';
import { SignUpDialog } from '@wsh-2025/client/src/features/auth/components/SignUpDialog';
import { AuthDialogType } from '@wsh-2025/client/src/features/auth/constants/auth_dialog_type';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthDialogType } from '@wsh-2025/client/src/features/auth/hooks/useAuthDialogType';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';
import { useSubscribePointer } from '@wsh-2025/client/src/features/layout/hooks/useSubscribePointer';
import { ErrorBoundary } from '@wsh-2025/client/src/app/ErrorBoundary';

interface Props {
  children: ReactNode;
}

// 簡素化したLayoutコンポーネント
export const Layout = ({ children }: Props) => {
  useSubscribePointer();

  const authActions = useAuthActions();
  const authDialogType = useAuthDialogType();
  const user = useAuthUser();

  // パスの代わりにナビゲーションタイプを使用（より安定）
  const navigationType = useNavigationType();
  const [isTimetablePage, setIsTimetablePage] = useState(false);

  // 現在のURLからページタイプを判定
  useEffect(() => {
    const pathname = window.location.pathname;
    setIsTimetablePage(pathname === '/timetable');
  }, [navigationType]);

  const [scrollTopOffset, setScrollTopOffset] = useState(0);
  const [shouldHeaderBeTransparent, setShouldHeaderBeTransparent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollTopOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setShouldHeaderBeTransparent(scrollTopOffset > 80);
  }, [scrollTopOffset]);

  const isSignedIn = user != null;
  const isLoading = false;

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-900 p-4 text-white">
          <h2 className="mb-2 text-xl font-bold">レイアウトエラー</h2>
          <p>レイアウトコンポーネントでエラーが発生しました。</p>
        </div>
      }
    >
      <div className="flex min-h-[100vh] w-full flex-col">
        <header
          className={classNames(
            'sticky top-[0px] z-10 flex h-[80px] w-full flex-row',
            !isLoading && shouldHeaderBeTransparent
              ? 'bg-gradient-to-b from-[#171717] to-transparent'
              : 'bg-gradient-to-b from-[#171717] to-[#171717]',
          )}
        >
          <Link className="block flex w-[188px] items-center justify-center px-[8px]" to="/">
            <img alt="AREMA" className="object-contain" height={36} src="/public/arema.svg" width={98} />
          </Link>
        </header>

        <div className="flex flex-1">
          <aside className="sticky top-[80px] flex h-[calc(100vh-80px)] w-[188px] flex-col items-center self-start bg-[#171717]">
            <nav>
              <button
                className="block flex h-[56px] w-[188px] items-center justify-center bg-transparent pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
                type="button"
                onClick={isSignedIn ? authActions.openSignOutDialog : authActions.openSignInDialog}
              >
                <div
                  className={`i-fa-solid:${isSignedIn ? 'sign-out-alt' : 'user'} m-[4px] size-[20px] shrink-0 grow-0`}
                />
                <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">
                  {isSignedIn ? 'ログアウト' : 'ログイン'}
                </span>
              </button>

              <Link
                className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
                to="/"
              >
                <div className="i-bi:house-fill m-[4px] size-[20px] shrink-0 grow-0" />
                <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">ホーム</span>
              </Link>

              <Link
                className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
                to="/timetable"
              >
                <div className="i-fa-solid:calendar m-[4px] size-[20px] shrink-0 grow-0" />
                <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">番組表</span>
              </Link>
            </nav>
          </aside>

          <main className={`min-h-screen flex-1 ${isTimetablePage ? '' : 'pb-[100px]'}`}>
            {/* React Flipping機能を削除して簡略化 */}
            <div className="size-full">{children}</div>
          </main>
        </div>

        {isLoading ? (
          <div className="sticky top-[80px] z-50">
            <Loading />
          </div>
        ) : null}
      </div>

      <SignInDialog
        isOpen={authDialogType === AuthDialogType.SignIn}
        onClose={authActions.closeDialog}
        onOpenSignUp={authActions.openSignUpDialog}
      />
      <SignUpDialog
        isOpen={authDialogType === AuthDialogType.SignUp}
        onClose={authActions.closeDialog}
        onOpenSignIn={authActions.openSignInDialog}
      />
      <SignOutDialog isOpen={authDialogType === AuthDialogType.SignOut} onClose={authActions.closeDialog} />
    </ErrorBoundary>
  );
};
