import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

export const Header = () => {
  const isLoading = false; // TODO: Replace with your loading state
  const [scrollTopOffset, setScrollTopOffset] = useState(0);
  const [shouldHeaderBeTransparent, setShouldHeaderBeTransparent] = useState(false);

  const handleScroll = useCallback(() => {
    setScrollTopOffset(window.scrollY);
  }, [setScrollTopOffset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setShouldHeaderBeTransparent(scrollTopOffset > 80);
  }, [scrollTopOffset]);

  return (
    <header
      className={classNames(
        'sticky top-[0px] z-10 order-1 flex h-[80px] w-full flex-row [grid-area:a1/a1/b1/b1]',
        !isLoading && shouldHeaderBeTransparent
          ? 'bg-gradient-to-b from-[#171717] to-transparent'
          : 'bg-gradient-to-b from-[#171717] to-[#171717]',
      )}
    >
      <Link className="block flex w-[188px] items-center justify-center px-[8px]" to="/">
        <img
          alt="AREMA"
          className="object-contain"
          height={36}
          src={`https://deqdfv99n42lf.cloudfront.net/public/arema.svg`}
          width={98}
        />
      </Link>
    </header>
  );
};
