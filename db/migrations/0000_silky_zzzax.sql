CREATE TABLE `parkings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plates` (
	`id` text PRIMARY KEY NOT NULL,
	`plate` text NOT NULL,
	`custom_name` text,
	`color` text,
	`is_authorized` integer,
	`authorized_until` integer,
	`created_at` integer NOT NULL,
	`parking_id` text NOT NULL,
	FOREIGN KEY (`parking_id`) REFERENCES `parkings`(`id`) ON UPDATE no action ON DELETE no action
);
