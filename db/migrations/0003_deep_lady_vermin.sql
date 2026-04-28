PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_plates` (
	`id` text PRIMARY KEY NOT NULL,
	`plate` text NOT NULL,
	`custom_name` text,
	`custom_infos` text,
	`country` text NOT NULL,
	`is_authorized` integer,
	`authorized_until` integer,
	`last_seen` integer NOT NULL,
	`created_at` integer NOT NULL,
	`parking_id` text NOT NULL,
	FOREIGN KEY (`parking_id`) REFERENCES `parkings`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_plates`("id", "plate", "custom_name", "custom_infos", "country", "is_authorized", "authorized_until", "last_seen", "created_at", "parking_id") SELECT "id", "plate", "custom_name", "custom_infos", "country", "is_authorized", "authorized_until", "last_seen", "created_at", "parking_id" FROM `plates`;--> statement-breakpoint
DROP TABLE `plates`;--> statement-breakpoint
ALTER TABLE `__new_plates` RENAME TO `plates`;--> statement-breakpoint
PRAGMA foreign_keys=ON;