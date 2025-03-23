import { ElementScrollRestoration } from "@epic-web/restore-scroll";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type * as schema from "@wsh-2025/schema/src/api/schema";
import { useRef } from "react";
import type { ArrayValues } from "type-fest";
import { useMergeRefs } from "use-callback-ref";

import { EpisodeItem } from "@wsh-2025/client/src/features/recommended/components/EpisodeItem";
import { SeriesItem } from "@wsh-2025/client/src/features/recommended/components/SeriesItem";
import { useScrollSnap } from "@wsh-2025/client/src/features/recommended/hooks/useScrollSnap";

interface Props {
	module: ArrayValues<
		StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>
	>;
}

export const CarouselSection = ({ module }: Props) => {
	const containerRefForScrollSnap = useScrollSnap({ scrollPadding: 24 });
	const containerRefForItemWidth = useRef<HTMLDivElement>(null);
	const mergedRef = useMergeRefs([
		containerRefForItemWidth,
		containerRefForScrollSnap,
	]);

	return (
		<>
			<div className="w-full">
				<h2 className="mb-[16px] w-full text-[22px] font-bold">
					{module.title}
				</h2>
				<div
					key={module.id}
					ref={mergedRef}
					className="relative mx-[-24px] grid auto-cols-[minmax(276px,1fr)] grid-flow-col gap-x-3 overflow-x-auto overflow-y-hidden pl-6 pr-14"
					data-scroll-restore={`carousel-${module.id}`}
				>
					{module.items.map((item) => (
						<div key={item.id} className="shrink-0 grow-0">
							{item.series != null ? (
								<SeriesItem loading="lazy" series={item.series} />
							) : null}
							{item.episode != null ? (
								<EpisodeItem episode={item.episode} loading="lazy" />
							) : null}
						</div>
					))}
				</div>
			</div>

			<ElementScrollRestoration
				direction="horizontal"
				elementQuery={`[data-scroll-restore="carousel-${module.id}"]`}
			/>
		</>
	);
};
