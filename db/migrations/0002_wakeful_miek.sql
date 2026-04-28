ALTER TABLE `parkings` ADD `last_used` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `parkings` DROP COLUMN `countrys`;--> statement-breakpoint
ALTER TABLE `plates` ADD `last_seen` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `plates` DROP COLUMN `color`;