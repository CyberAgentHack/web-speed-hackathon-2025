import { useEffect, useRef } from "react";
import { useUpdate } from "react-use";

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
	// const forceUpdate = useUpdate();
	const containerRef = useRef<HTMLDivElement>(null);

	if (containerRef.current == null) {
		return { ref: containerRef, width: MIN_WIDTH };
	}

	return { ref: containerRef };
}
