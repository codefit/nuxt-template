CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nameId` integer NOT NULL,
	`slugId` integer NOT NULL,
	`excerptId` integer,
	`isPublished` integer DEFAULT 1 NOT NULL,
	`publishedAt` integer,
	`archivedAt` integer,
	`deletedAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`nameId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`slugId`) REFERENCES `slugs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`excerptId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `articles_is_published_idx` ON `articles` (`isPublished`);--> statement-breakpoint
CREATE INDEX `articles_published_at_idx` ON `articles` (`publishedAt`);--> statement-breakpoint
CREATE TABLE `entities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entities_key_uidx` ON `entities` (`key`);--> statement-breakpoint
CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`isActive` integer DEFAULT 1 NOT NULL,
	`isDefault` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `languages_code_uidx` ON `languages` (`code`);--> statement-breakpoint
CREATE INDEX `languages_is_active_idx` ON `languages` (`isActive`);--> statement-breakpoint
CREATE INDEX `languages_is_default_idx` ON `languages` (`isDefault`);--> statement-breakpoint
CREATE TABLE `long_text_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`longTextId` integer NOT NULL,
	`languageId` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`longTextId`) REFERENCES `long_texts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `long_text_translations_long_text_language_uidx` ON `long_text_translations` (`longTextId`,`languageId`);--> statement-breakpoint
CREATE TABLE `long_texts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `metas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entityId` integer NOT NULL,
	`modelId` integer NOT NULL,
	`contentLongId` integer,
	`metaTitleId` integer,
	`metaDescriptionId` integer,
	`metaKeywordsId` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`entityId`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contentLongId`) REFERENCES `long_texts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`metaTitleId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`metaDescriptionId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`metaKeywordsId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metas_entity_model_uidx` ON `metas` (`entityId`,`modelId`);--> statement-breakpoint
CREATE INDEX `metas_model_id_idx` ON `metas` (`modelId`);--> statement-breakpoint
CREATE TABLE `slug_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slugId` integer NOT NULL,
	`languageId` integer NOT NULL,
	`name` text NOT NULL,
	`content` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`slugId`) REFERENCES `slugs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_translations_slug_language_uidx` ON `slug_translations` (`slugId`,`languageId`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug_translations_language_content_uidx` ON `slug_translations` (`languageId`,`content`);--> statement-breakpoint
CREATE INDEX `slug_translations_name_idx` ON `slug_translations` (`name`);--> statement-breakpoint
CREATE INDEX `slug_translations_content_idx` ON `slug_translations` (`content`);--> statement-breakpoint
CREATE TABLE `slugs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `text_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`textId` integer NOT NULL,
	`languageId` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`textId`) REFERENCES `texts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `text_translations_text_language_uidx` ON `text_translations` (`textId`,`languageId`);--> statement-breakpoint
CREATE INDEX `text_translations_content_idx` ON `text_translations` (`content`);--> statement-breakpoint
CREATE TABLE `texts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
