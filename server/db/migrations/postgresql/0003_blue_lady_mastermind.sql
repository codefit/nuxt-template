CREATE TABLE "constants" (
	"id" serial PRIMARY KEY NOT NULL,
	"group" text NOT NULL,
	"key" text NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"isActive" integer DEFAULT 1 NOT NULL,
	"isPrivate" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "constants_key_uidx" ON "constants" USING btree ("key");--> statement-breakpoint
CREATE INDEX "constants_group_idx" ON "constants" USING btree ("group");--> statement-breakpoint
CREATE INDEX "constants_is_active_idx" ON "constants" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "constants_is_private_idx" ON "constants" USING btree ("isPrivate");