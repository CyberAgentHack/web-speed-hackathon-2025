DROP INDEX `idx_episode_seriesId`;--> statement-breakpoint
DROP INDEX `idx_program_startAt`;--> statement-breakpoint
DROP INDEX `idx_recommendedItem_episodeId`;--> statement-breakpoint
CREATE INDEX `idx_recommendedItem_moduleId` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `idx_recommendedModule_referenceId` ON `recommendedModule` (`referenceId`);