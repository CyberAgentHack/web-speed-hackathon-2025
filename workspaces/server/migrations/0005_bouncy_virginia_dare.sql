CREATE INDEX `idx_episode_seriesId` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_episode_streamId` ON `episode` (`streamId`);--> statement-breakpoint
CREATE INDEX `idx_program_channelId` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `idx_program_episodeId` ON `program` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_moduleId` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_seriesId` ON `recommendedItem` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_episodeId` ON `recommendedItem` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_referenceId` ON `recommendedModule` (`referenceId`);