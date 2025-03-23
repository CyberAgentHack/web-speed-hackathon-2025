import { FC } from 'react';

interface SpinnerProps {
  className?: string;
  color?: string;
  size?: number;
}

export const Spinner: FC<SpinnerProps> = ({ className = '', color = 'currentColor', size = 48 }) => {
  return (
    <svg className={className} height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M12 3c4.97 0 9 4.03 9 9" strokeDasharray={16} strokeDashoffset={16}>
          <animate attributeName="stroke-dashoffset" dur="0.3s" fill="freeze" values="16;0" />
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
        <path
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
          strokeDasharray={64}
          strokeDashoffset={64}
          strokeOpacity={0.3}
        >
          <animate attributeName="stroke-dashoffset" dur="1.2s" fill="freeze" values="64;0" />
        </path>
      </g>
    </svg>
  );
};

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
        <Spinner color="#FFFFFF" size={48} />
      </div>
    </div>
  );
};
