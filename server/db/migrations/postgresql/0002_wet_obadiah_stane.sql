CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"entityId" integer NOT NULL,
	"modelId" integer NOT NULL,
	"collection" text NOT NULL,
	"fileType" text NOT NULL,
	"pathname" text NOT NULL,
	"url" text,
	"mime" text NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt" text,
	"rank" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_entityId_entities_id_fk" FOREIGN KEY ("entityId") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_entity_model_idx" ON "media" USING btree ("entityId","modelId");--> statement-breakpoint
CREATE INDEX "media_entity_model_collection_idx" ON "media" USING btree ("entityId","modelId","collection");--> statement-breakpoint
CREATE INDEX "media_rank_idx" ON "media" USING btree ("entityId","modelId","collection","rank");
