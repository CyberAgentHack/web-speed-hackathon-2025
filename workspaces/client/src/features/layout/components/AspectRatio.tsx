import { type ReactNode, useEffect, useRef } from "react";

interface Props {
	children: ReactNode;
	ratioHeight: number;
	ratioWidth: number;
}

export const AspectRatio = ({ children }: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {}, []);

	return (
		<div ref={containerRef} className={`aspect-16/9 relative w-full`}>
			{children}
		</div>
	);
};
