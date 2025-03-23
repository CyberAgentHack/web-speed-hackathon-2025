CREATE INDEX `episode_order` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `program_start_at` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `recommended_module_refrence_id_order` ON `recommendedModule` (`referenceId`,`order`);--> statement-breakpoint
CREATE INDEX `user_email` ON `user` (`email`);