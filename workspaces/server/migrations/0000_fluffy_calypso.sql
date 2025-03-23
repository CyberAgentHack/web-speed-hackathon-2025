CREATE TABLE `channel` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`logoUrl` text NOT NULL
);
CREATE INDEX idx_channel_name ON `channel` (`name`);

--> statement-breakpoint
CREATE TABLE `episode` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`title` text NOT NULL,
	`order` integer NOT NULL,
	`seriesId` text NOT NULL,
	`streamId` text NOT NULL,
	`premium` boolean NOT NULL DEFAULT false,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`streamId`) REFERENCES `stream`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX idx_episode_seriesId ON `episode` (`seriesId`);
CREATE INDEX idx_episode_streamId ON `episode` (`streamId`);

--> statement-breakpoint
CREATE TABLE `program` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`startAt` text NOT NULL,
	`endAt` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`channelId` text NOT NULL,
	`episodeId` text NOT NULL,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`episodeId`) REFERENCES `episode`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX idx_program_channelId ON `program` (`channelId`);
CREATE INDEX idx_program_episodeId ON `program` (`episodeId`);
CREATE INDEX idx_program_startAt ON `program` (`startAt`);

--> statement-breakpoint
CREATE TABLE `recommendedItem` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`moduleId` text NOT NULL,
	`seriesId` text,
	`episodeId` text,
	FOREIGN KEY (`moduleId`) REFERENCES `recommendedModule`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`episodeId`) REFERENCES `episode`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX idx_recommendedItem_moduleId ON `recommendedItem` (`moduleId`);

--> statement-breakpoint
CREATE TABLE `recommendedModule` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`title` text NOT NULL,
	`referenceId` text NOT NULL,
	`type` text NOT NULL CHECK(`type` IN ('carousel', 'jumbotron'))
);
CREATE INDEX idx_recommendedModule_referenceId ON `recommendedModule` (`referenceId`);

--> statement-breakpoint
CREATE TABLE `series` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`title` text NOT NULL
);
CREATE INDEX idx_series_title ON `series` (`title`);

--> statement-breakpoint
CREATE TABLE `stream` (
	`id` text PRIMARY KEY NOT NULL,
	`numberOfChunks` integer NOT NULL
);

--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL UNIQUE,
	`password` text NOT NULL
);
CREATE INDEX idx_user_email ON `user` (`email`);
