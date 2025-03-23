CREATE INDEX `idx_episode_streamId` ON `episode` (`streamId`);--> statement-breakpoint
CREATE INDEX `idx_program_startAt` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `idx_channelId` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_episodeId` ON `recommendedItem` (`episodeId`);