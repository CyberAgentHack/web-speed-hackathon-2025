CREATE TABLE `channel` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`logoUrl` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `episode` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`title` text NOT NULL,
	`order` integer NOT NULL,
	`seriesId` text NOT NULL,
	`streamId` text NOT NULL,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`streamId`) REFERENCES `stream`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `program` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`startAt` integer NOT NULL,
	`endAt` integer NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`channelId` text NOT NULL,
	`episodeId` text NOT NULL,
	FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`episodeId`) REFERENCES `episode`(`id`) ON UPDATE no action ON DELETE no action
);
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
--> statement-breakpoint
CREATE TABLE `recommendedModule` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`title` text NOT NULL,
	`referenceId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stream` (
	`id` text PRIMARY KEY NOT NULL,
	`numberOfChunks` integer NOT NULL
);

CREATE INDEX idx_recommended_module_reference_id ON recommended_module(reference_id);
CREATE INDEX idx_recommended_module_order ON recommended_module(order);
CREATE INDEX idx_recommended_item_order ON recommended_item(order);
