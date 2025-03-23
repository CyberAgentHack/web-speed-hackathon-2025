CREATE INDEX `seriesIdIndex` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `orderIndex` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `startAtIndex` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `channelIdIndex` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `episodeIdIndex` ON `program` (`episodeId`);--> statement-breakpoint
CREATE INDEX `moduleIdIndex` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `seriesIdIndex` ON `recommendedItem` (`seriesId`);--> statement-breakpoint
CREATE INDEX `episodeIdIndex` ON `recommendedItem` (`episodeId`);--> statement-breakpoint
CREATE INDEX `orderIndex` ON `recommendedModule` (`order`);--> statement-breakpoint
CREATE INDEX `referenceIdIndex` ON `recommendedModule` (`referenceId`);