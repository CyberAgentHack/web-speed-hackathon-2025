DROP INDEX `idx_recommendedItem_moduleId`;--> statement-breakpoint
DROP INDEX `idx_recommendedItem_seriesId`;--> statement-breakpoint
DROP INDEX `idx_recommendedItem_episodeId`;--> statement-breakpoint
CREATE INDEX `idx_program_startAt` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `idx_channelId` ON `program` (`channelId`);