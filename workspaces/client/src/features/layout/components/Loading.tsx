import { SVGProps } from 'react';
import { JSX } from 'react/jsx-runtime';

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <DownloadOffTwotoneLoop />
    </div>
  );
};

export const DownloadOffTwotoneLoop = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask id="lineMdDownloadOffTwotoneLoop0">
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"
          fill="#fff"
          fillOpacity="0"
          strokeDasharray="20"
          strokeDashoffset="20"
        >
          <animate
            attributeName="d"
            begin="0.5s"
            dur="1.5s"
            repeatCount="indefinite"
            values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"
          ></animate>
          <animate attributeName="fill-opacity" begin="0.7s" dur="0.15s" fill="freeze" values="0;0.3"></animate>
          <animate attributeName="stroke-dashoffset" dur="0.4s" fill="freeze" values="20;0"></animate>
        </path>
        <path d="M6 19h12" strokeDasharray="14" strokeDashoffset="14">
          <animate attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" fill="freeze" values="14;0"></animate>
        </path>
        <path d="M0 11h24" stroke="#000" strokeDasharray="28" strokeDashoffset="28" transform="rotate(45 13 12)">
          <animate attributeName="stroke-dashoffset" begin="0.9s" dur="0.4s" fill="freeze" values="28;0"></animate>
        </path>
        <path d="M0 13h22" strokeDasharray="28" strokeDashoffset="28" transform="rotate(45 13 12)">
          <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0 13h22;M2 13h22;M0 13h22"></animate>
          <animate attributeName="stroke-dashoffset" begin="0.9s" dur="0.4s" fill="freeze" values="28;0"></animate>
        </path>
      </g>
    </mask>
    <rect fill="currentColor" height="24" mask="url(#lineMdDownloadOffTwotoneLoop0)" width="24"></rect>
  </svg>
);
