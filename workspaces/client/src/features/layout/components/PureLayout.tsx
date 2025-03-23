import classNames from 'classnames';
import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router';

import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';

interface Props {
  children: ReactNode;
  isLoading?: boolean;
  isSignedIn?: boolean;
  isTimetablePage?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  shouldHeaderBeTransparent?: boolean;
}

export const PureLayout = ({
  children,
  isLoading = false,
  isSignedIn = false,
  isTimetablePage = false,
  onClick,
  shouldHeaderBeTransparent = false,
}: Props) => {
  return (
    <>
      <div className="grid h-auto min-h-[100vh] w-full grid-cols-[188px_minmax(0,1fr)] grid-rows-[80px_calc(100vh-80px)_minmax(0,1fr)] flex-col [grid-template-areas:'a1_b1''a2_b2''a3_b3']">
        <header
          className={classNames(
            'pointer-events-none sticky top-[0px] z-10 order-1 flex h-[80px] w-full flex-row [grid-area:a1/a1/b1/b1]',
            !isLoading && shouldHeaderBeTransparent
              ? 'bg-gradient-to-b from-[#171717] to-transparent'
              : 'bg-gradient-to-b from-[#171717] to-[#171717]',
          )}
        >
          <Link className="pointer-events-auto block flex w-[188px] items-center justify-center px-[8px]" to="/">
            <img alt="AREMA" className="object-contain" height={36} loading="lazy" src="/public/arema.png" width={98} />
          </Link>
        </header>

        <aside className="pointer-events-auto sticky top-[0px] flex h-[100vh] flex-col items-center bg-[#171717] pt-[80px] [grid-area:a1/a1/a2/a2]">
          <nav>
            <button
              className="block flex h-[56px] w-[188px] items-center justify-center bg-transparent pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              type="button"
              onClick={onClick}
            >
              {/* <div
                className={`i-fa-solid:${isSignedIn ? 'sign-out-alt' : 'user'} m-[4px] size-[20px] shrink-0 grow-0`}
              /> */}
              {isSignedIn ? (
                <img
                  className="shrink-0 grow-0"
                  height={20}
                  loading="lazy"
                  src="/public/icons/fa-solid--sign-out-alt.svg"
                  width={20}
                />
              ) : (
                <img
                  className="shrink-0 grow-0"
                  height={20}
                  loading="lazy"
                  src="/public/icons/fa-solid--user.svg"
                  width={20}
                />
              )}
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">
                {isSignedIn ? 'ログアウト' : 'ログイン'}
              </span>
            </button>

            <Link
              className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/"
            >
              {/* <div className="i-bi:house-fill m-[4px] size-[20px] shrink-0 grow-0" /> */}
              <img className="shrink-0 grow-0" height={20} src="/public/icons/house-fill.svg" width={20} />
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">ホーム</span>
            </Link>

            <Link
              className="block flex h-[56px] w-[188px] items-center justify-center pb-[8px] pl-[20px] pr-[8px] pt-[8px]"
              to="/timetable"
            >
              {/* <div className="i-fa-solid:calendar m-[4px] size-[20px] shrink-0 grow-0" /> */}
              <img className="shrink-0 grow-0" height={20} src="/public/icons/fa-solid--calendar.svg" width={20} />
              <span className="grow-1 shrink-1 ml-[16px] text-left text-[14px] font-bold">番組表</span>
            </Link>
          </nav>
        </aside>

        <main className={isTimetablePage ? '[grid-area:b2]' : '[grid-area:b2/b2/b3/b3]'}>{children}</main>

        {isLoading ? (
          <div className="sticky top-[80px] z-50 [grid-area:b2]">
            <Loading />
          </div>
        ) : null}
      </div>
    </>
  );
};
