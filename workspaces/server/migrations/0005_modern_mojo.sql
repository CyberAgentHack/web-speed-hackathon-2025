CREATE INDEX `episode_seriesId` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `program_channelId` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `recommendedItem_moduleId` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `recommendedModule_referenceId` ON `recommendedModule` (`referenceId`);