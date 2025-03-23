CREATE INDEX `idx_episode_seriesId` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_episode_order` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `idx_episode_streamId` ON `episode` (`streamId`);--> statement-breakpoint
CREATE INDEX `idx_episode_premium` ON `episode` (`premium`);--> statement-breakpoint
CREATE INDEX `idx_program_startAt` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `idx_program_endAt` ON `program` (`endAt`);--> statement-breakpoint
CREATE INDEX `idx_channelId` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `idx_episodeId` ON `program` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_order` ON `recommendedItem` (`order`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_moduleId` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_seriesId` ON `recommendedItem` (`seriesId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_episodeId` ON `recommendedItem` (`episodeId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_order` ON `recommendedModule` (`order`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_referenceId` ON `recommendedModule` (`referenceId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_type` ON `recommendedModule` (`type`);