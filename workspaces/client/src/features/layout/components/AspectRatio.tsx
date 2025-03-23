import { type ReactNode } from "react";

interface Props {
	children: ReactNode;
	ratioHeight: number;
	ratioWidth: number;
}

export const AspectRatio = ({ children }: Props) => {
	// const containerRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {}, []);

	return <div className={`aspect-16/9 relative w-full`}>{children}</div>;
};
