import type { ReactElement, Ref } from "react";

interface Props {
	children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
	classNames: {
		default?: string;
		hovered?: string;
	};
}

export const Hoverable = (props: Props) => {
	return (
		<div
			className={`cursor-pointer ${props.classNames.default} hover:${props.classNames.hovered}`}
		>
			{props.children}
		</div>
	);
};
