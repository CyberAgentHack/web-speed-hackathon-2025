import { useEffect } from "react";

import { useStore } from "@wsh-2025/client/src/app/StoreContext";

export function useSubscribePointer(): void {
	const updatePointer = useStore((s) => s.features.layout.updatePointer);

	useEffect(() => {
		const abortController = new AbortController();

		const current = { x: 0, y: 0 };
		const previous = { x: 0, y: 0 };

		const handlePointerMove = (ev: MouseEvent) => {
			current.x = ev.clientX;
			current.y = ev.clientY;
		};

		window.addEventListener("pointermove", handlePointerMove, {
			signal: abortController.signal,
		});

		let animationFrameId: number;

		const updateFrame = () => {
			// 位置が変わった場合のみ更新する
			if (previous.x !== current.x || previous.y !== current.y) {
				updatePointer({ ...current });
				previous.x = current.x;
				previous.y = current.y;
			}

			animationFrameId = requestAnimationFrame(updateFrame);
		};

		animationFrameId = requestAnimationFrame(updateFrame);

		return () => {
			cancelAnimationFrame(animationFrameId);
			abortController.abort();
		};
	}, [updatePointer]);
}
