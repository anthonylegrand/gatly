CREATE TABLE `parkings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`last_used` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plates` (
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
