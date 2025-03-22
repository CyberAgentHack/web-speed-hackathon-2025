import classNames from 'classnames';
import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Link, useLocation, useNavigation } from 'react-router';

import { AuthDialogType } from '@wsh-2025/client/src/features/auth/constants/auth_dialog_type';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthDialogType } from '@wsh-2025/client/src/features/auth/hooks/useAuthDialogType';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';
import { debounce } from '@wsh-2025/client/src/utils/debounce';

// ダイアログコンポーネントを遅延ロード
const SignInDialog = lazy(() =>
  import('@wsh-2025/client/src/features/auth/components/SignInDialog').then((module) => ({
    default: module.SignInDialog,
  })),
);
const SignUpDialog = lazy(() =>
  import('@wsh-2025/client/src/features/auth/components/SignUpDialog').then((module) => ({
    default: module.SignUpDialog,
  })),
);
const SignOutDialog = lazy(() =>
  import('@wsh-2025/client/src/features/auth/components/SignOutDialog').then((module) => ({
    default: module.SignOutDialog,
  })),
);

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const navigation = useNavigation();
  const isLoading =
    navigation.location != null && (navigation.location.state as { loading?: string } | null)?.['loading'] !== 'none';

  const location = useLocation();
  const isTimetablePage = location.pathname === '/timetable';

  const authActions = useAuthActions();
  const authDialogType = useAuthDialogType();
  const user = useAuthUser();

  const [scrollTopOffset, setScrollTopOffset] = useState(0);
  const [shouldHeaderBeTransparent, setShouldHeaderBeTransparent] = useState(false);

  useEffect(() => {
    // スクロールイベントにdebounceを適用
    const handleScroll = debounce(() => {
      setScrollTopOffset(window.scrollY);
    }, 16); // 約60FPSに制限

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // メモリリークを防止
    };
  }, []);

  useEffect(() => {
    setShouldHeaderBeTransparent(scrollTopOffset > 80);
  }, [scrollTopOffset]);

  const isSignedIn = user != null;

  return (
    <>
      <div className="grid h-auto min-h-[100vh] w-full grid-cols-[188px_minmax(0,1fr)] grid-rows-[80px_calc(100vh-80px)_minmax(0,1fr)] flex-col [grid-template-areas:'a1_b1''a2_b2''a3_b3']">
        <header
          className={classNames(
            'sticky top-[0px] z-10 order-1 flex h-[80px] w-full flex-row [grid-area:a1/a1/b1/b1]',
            !isLoading && shouldHeaderBeTransparent
              ? 'bg-gradient-to-b from-[#171717] to-transparent'
              : 'bg-gradient-to-b from-[#171717] to-[#171717]',
          )}
        >
          <Link className="block flex w-[188px] items-center justify-center px-[8px]" to="/">
            <img alt="AREMA" className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
          </Link>
        </header>

        <aside className="sticky top-[0px] flex h-[100vh] flex-col items-center bg-[#171717] pt-[80px] [grid-area:a1/a1/a2/a2]">
          <nav>
            <button
              className="block flex h-[56px] w-[188px] items-center justify-center bg-transparent pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              type="button"
              onClick={isSignedIn ? authActions.openSignOutDialog : authActions.openSignInDialog}
            >
              <div className="m-[4px]">
                {isSignedIn ? (
                  // ログアウトアイコン
                  // <div className={`i-fa-solid:sign-out-alt m-[4px] size-[20px] shrink-0 grow-0`} />
                  <svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34M192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  // ログインアイコン
                  <svg height="20" viewBox="0 0 448 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">
                {isSignedIn ? 'ログアウト' : 'ログイン'}
              </span>
            </button>

            <Link
              className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/"
            >
              {/* ホームアイコン */}
              <svg
                className="m-[4px] size-[20px] shrink-0 grow-0"
                fill="currentColor"
                height="1em"
                viewBox="0 0 16 16"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                  fillRule="evenodd"
                />
                <path
                  d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                  fillRule="evenodd"
                />
              </svg>
              {/* <div className="i-bi:house-fill m-[4px] size-[20px] shrink-0 grow-0" /> */}
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">ホーム</span>
            </Link>

            <Link
              className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/timetable"
            >
              {/* カレンダーアイコン */}
              <div className="m-[4px]">
                <svg
                  fill="currentColor"
                  height="20"
                  viewBox="0 0 448 512"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z" />
                </svg>
              </div>
              {/* <div className="i-fa-solid:calendar m-[4px] size-[20px] shrink-0 grow-0" /> */}
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">番組表</span>
            </Link>
          </nav>
        </aside>

        <main className={isTimetablePage ? '[grid-area:b2]' : '[grid-area:b2/b2/b3/b3]'}>
          <Flipper className="size-full" flipKey={location.key} spring="noWobble">
            {children}
          </Flipper>
        </main>

        {isLoading ? (
          <div className="sticky top-[80px] z-50 [grid-area:b2]">
            <Loading />
          </div>
        ) : null}
      </div>

      {/* 必要なときだけダイアログをレンダリング */}
      <Suspense fallback={null}>
        {authDialogType === AuthDialogType.SignIn && (
          <SignInDialog isOpen={true} onClose={authActions.closeDialog} onOpenSignUp={authActions.openSignUpDialog} />
        )}
        {authDialogType === AuthDialogType.SignUp && (
          <SignUpDialog isOpen={true} onClose={authActions.closeDialog} onOpenSignIn={authActions.openSignInDialog} />
        )}
        {authDialogType === AuthDialogType.SignOut && <SignOutDialog isOpen={true} onClose={authActions.closeDialog} />}
      </Suspense>
    </>
  );
};
