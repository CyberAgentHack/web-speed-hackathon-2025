import { createFetch, createSchema } from "@better-fetch/fetch";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { getChannelByIdResponse } from "@wsh-2025/schema/src/api/schema";
import {
	getChannelsRequestQuery,
	getChannelsResponse,
} from "@wsh-2025/schema/src/openapi/schema";
import { create, windowedFiniteBatchScheduler } from "@yornaath/batshit";

import { schedulePlugin } from "@wsh-2025/client/src/features/requests/schedulePlugin";

const $fetch = createFetch({
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	baseURL: process.env["API_BASE_URL"] ?? "/api",
	plugins: [schedulePlugin],
	schema: createSchema({
		"/channels": {
			output: getChannelsResponse,
			query: getChannelsRequestQuery,
		},
	}),
	throw: true,
});

const batcher = create({
	async fetcher(queries: { channelId: string }[]) {
		const data = await $fetch("/channels", {
			query: {
				channelIds: queries.map((q) => q.channelId).join(","),
			},
		});
		return data;
	},
	resolver(items, query: { channelId: string }) {
		const item = items.find((item) => item.id === query.channelId);
		if (item == null) {
			throw new Error("Channel is not found.");
		}
		return item;
	},
	scheduler: windowedFiniteBatchScheduler({
		maxBatchSize: 100,
		windowMs: 1000,
	}),
});

interface ChannelService {
	fetchChannelById: (query: {
		channelId: string;
	}) => Promise<StandardSchemaV1.InferOutput<typeof getChannelByIdResponse>>;
	fetchChannels: () => Promise<
		StandardSchemaV1.InferOutput<typeof getChannelsResponse>
	>;
}

export const channelService: ChannelService = {
	async fetchChannelById({ channelId }) {
		const channel = await batcher.fetch({ channelId });
		return channel;
	},
	async fetchChannels() {
		const data = await $fetch("/channels", { query: {} });
		return data;
	},
};
