CREATE INDEX `idx_channel_name` ON `channel` (`name`);--> statement-breakpoint
CREATE INDEX `idx_episode_order` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `idx_episode_series_id` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_program_channel_id` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `idx_program_episode_id` ON `program` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommended_item_order` ON `recommendedItem` (`order`);--> statement-breakpoint
CREATE INDEX `idx_recommended_module_reference_id` ON `recommendedModule` (`referenceId`);--> statement-breakpoint
CREATE INDEX `idx_recommended_module_order` ON `recommendedModule` (`order`);--> statement-breakpoint
CREATE INDEX `idx_series_title` ON `series` (`title`);--> statement-breakpoint
CREATE INDEX `idx_stream_number_of_chunks` ON `stream` (`numberOfChunks`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `user` (`email`);