import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Link, useLocation, useNavigation } from 'react-router';

import { SignInDialog } from '@wsh-2025/client/src/features/auth/components/SignInDialog';
import { SignOutDialog } from '@wsh-2025/client/src/features/auth/components/SignOutDialog';
import { SignUpDialog } from '@wsh-2025/client/src/features/auth/components/SignUpDialog';
import { AuthDialogType } from '@wsh-2025/client/src/features/auth/constants/auth_dialog_type';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthDialogType } from '@wsh-2025/client/src/features/auth/hooks/useAuthDialogType';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';
import { useSubscribePointer } from '@wsh-2025/client/src/features/layout/hooks/useSubscribePointer';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  useSubscribePointer();

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
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - scrollTopOffset) > 5) {
        setScrollTopOffset(currentScroll);
      }
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [scrollTopOffset]);

  useEffect(() => {
    setShouldHeaderBeTransparent(scrollTopOffset > 80);
  }, [scrollTopOffset]);

  useEffect(() => {
    const checkIconsLoaded = () => {
      const icons = document.querySelectorAll('.i-fa-solid\\:user, .i-fa-solid\\:sign-out-alt, .i-bi\\:house-fill, .i-fa-solid\\:calendar');
      if (icons.length > 0) {
        const areIconsLoaded = Array.from(icons).every((icon) => {
          const styles = window.getComputedStyle(icon);
          return styles.backgroundImage !== 'none' && styles.maskImage !== 'none';
        });
        if (areIconsLoaded) {
          setIconsLoaded(true);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            checkIconsLoaded();
          }
        });
      },
      { threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      setIconsLoaded(true);
    }, 2000);

    const nav = document.querySelector('nav');
    if (nav) {
      observer.observe(nav);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const isSignedIn = user != null;

  return (
    <>
      <div className="grid h-auto min-h-[100vh] w-full grid-cols-[188px_minmax(0,1fr)] grid-rows-[80px_calc(100vh-80px)_minmax(0,1fr)] flex-col [grid-template-areas:'a1_b1''a2_b2''a3_b3']">
        <header
          className={classNames(
            'sticky top-[0px] z-10 order-1 flex h-[80px] w-full flex-row [grid-area:a1/a1/b1/b1] transition-colors duration-200',
            !isLoading && shouldHeaderBeTransparent
              ? 'bg-gradient-to-b from-[#171717] to-transparent'
              : 'bg-gradient-to-b from-[#171717] to-[#171717]',
          )}
        >
          <Link className="block flex w-[188px] items-center justify-center px-[8px]" to="/">
            <OptimizedImage
              priority
              alt="AREMA"
              className="object-contain"
              height={36}
              src="/public/arema.svg"
              width={98}
            />
          </Link>
        </header>

        <aside className="sticky top-[0px] flex h-[100vh] flex-col items-center bg-[#171717] pt-[80px] [grid-area:a1/a1/a2/a2]">
          <nav className="w-full">
            <button
              className="block flex h-[56px] w-full items-center justify-center bg-transparent pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              type="button"
              onClick={isSignedIn ? authActions.openSignOutDialog : authActions.openSignInDialog}
            >
              <div className={classNames(
                'm-[4px] size-[20px] shrink-0',
                iconsLoaded 
                  ? `i-fa-solid:${isSignedIn ? 'sign-out-alt' : 'user'}`
                  : 'bg-[#333333] rounded'
              )} />
              <span className="ml-[16px] text-left text-[14px] font-bold truncate">
                {isSignedIn ? 'ログアウト' : 'ログイン'}
              </span>
            </button>

            <Link
              className="block flex h-[56px] w-full items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/"
            >
              <div className={classNames(
                'm-[4px] size-[20px] shrink-0',
                iconsLoaded 
                  ? 'i-bi:house-fill'
                  : 'bg-[#333333] rounded'
              )} />
              <span className="ml-[16px] text-left text-[14px] font-bold truncate">ホーム</span>
            </Link>

            <Link
              className="block flex h-[56px] w-full items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/timetable"
            >
              <div className={classNames(
                'm-[4px] size-[20px] shrink-0',
                iconsLoaded 
                  ? 'i-fa-solid:calendar'
                  : 'bg-[#333333] rounded'
              )} />
              <span className="ml-[16px] text-left text-[14px] font-bold truncate">番組表</span>
            </Link>
          </nav>
        </aside>

        <main className={classNames(
          'min-h-[calc(100vh-80px)] w-full',
          'content-visibility-auto contain-intrinsic-size-[1000px]',
          isTimetablePage ? '[grid-area:b2]' : '[grid-area:b2/b2/b3/b3]'
        )}>
          <div className="relative w-full">
            <Flipper className="size-full" flipKey={location.key} spring="noWobble">
              <div className="min-h-[250px] space-y-[8px]">
                <div className="w-full px-[24px] py-[8px]">
                  {children}
                </div>
              </div>
            </Flipper>
          </div>
        </main>

        {isLoading && (
          <div className="sticky top-[80px] z-50 [grid-area:b2] bg-[#171717] min-h-[250px] flex items-center justify-center">
            <Loading />
          </div>
        )}
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
    </>
  );
};