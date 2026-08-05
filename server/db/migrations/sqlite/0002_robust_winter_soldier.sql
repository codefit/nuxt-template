CREATE TABLE `authors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`deletedAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `authors_name_idx` ON `authors` (`name`);--> statement-breakpoint
CREATE INDEX `authors_email_idx` ON `authors` (`email`);--> statement-breakpoint
ALTER TABLE `articles` ADD `authorId` integer REFERENCES authors(id);--> statement-breakpoint
CREATE INDEX `articles_author_id_idx` ON `articles` (`authorId`);