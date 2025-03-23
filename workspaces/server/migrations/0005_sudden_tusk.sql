CREATE INDEX `idx_channel_name` ON `channel` (`name`);--> statement-breakpoint
CREATE INDEX `idx_episode_seriesId` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_episode_streamId` ON `episode` (`streamId`);--> statement-breakpoint
CREATE INDEX `idx_episode_order` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `idx_program_startAt` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `idx_program_endAt` ON `program` (`endAt`);--> statement-breakpoint
CREATE INDEX `idx_program_channelId` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_order` ON `recommendedItem` (`order`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_seriesId` ON `recommendedItem` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_episodeId` ON `recommendedItem` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_order` ON `recommendedModule` (`order`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_type` ON `recommendedModule` (`type`);--> statement-breakpoint
CREATE INDEX `idx_series_title` ON `series` (`title`);--> statement-breakpoint
CREATE INDEX `idx_stream_numberOfChunks` ON `stream` (`numberOfChunks`);