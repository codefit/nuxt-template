CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameId" integer NOT NULL,
	"slugId" integer NOT NULL,
	"excerptId" integer,
	"authorId" integer,
	"isPublished" integer DEFAULT 1 NOT NULL,
	"publishedAt" timestamp,
	"archivedAt" timestamp,
	"deletedAt" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"deletedAt" timestamp,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"isActive" integer DEFAULT 1 NOT NULL,
	"isDefault" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "long_text_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"longTextId" integer NOT NULL,
	"languageId" integer NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "long_texts" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metas" (
	"id" serial PRIMARY KEY NOT NULL,
	"entityId" integer NOT NULL,
	"modelId" integer NOT NULL,
	"contentLongId" integer,
	"metaTitleId" integer,
	"metaDescriptionId" integer,
	"metaKeywordsId" integer,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slug_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slugId" integer NOT NULL,
	"languageId" integer NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slugs" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"textId" integer NOT NULL,
	"languageId" integer NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_nameId_texts_id_fk" FOREIGN KEY ("nameId") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_slugId_slugs_id_fk" FOREIGN KEY ("slugId") REFERENCES "public"."slugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_excerptId_texts_id_fk" FOREIGN KEY ("excerptId") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_authors_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "long_text_translations" ADD CONSTRAINT "long_text_translations_longTextId_long_texts_id_fk" FOREIGN KEY ("longTextId") REFERENCES "public"."long_texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "long_text_translations" ADD CONSTRAINT "long_text_translations_languageId_languages_id_fk" FOREIGN KEY ("languageId") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_entityId_entities_id_fk" FOREIGN KEY ("entityId") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_contentLongId_long_texts_id_fk" FOREIGN KEY ("contentLongId") REFERENCES "public"."long_texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_metaTitleId_texts_id_fk" FOREIGN KEY ("metaTitleId") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_metaDescriptionId_texts_id_fk" FOREIGN KEY ("metaDescriptionId") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_metaKeywordsId_texts_id_fk" FOREIGN KEY ("metaKeywordsId") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slug_translations" ADD CONSTRAINT "slug_translations_slugId_slugs_id_fk" FOREIGN KEY ("slugId") REFERENCES "public"."slugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slug_translations" ADD CONSTRAINT "slug_translations_languageId_languages_id_fk" FOREIGN KEY ("languageId") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_translations" ADD CONSTRAINT "text_translations_textId_texts_id_fk" FOREIGN KEY ("textId") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_translations" ADD CONSTRAINT "text_translations_languageId_languages_id_fk" FOREIGN KEY ("languageId") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_is_published_idx" ON "articles" USING btree ("isPublished");--> statement-breakpoint
CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("publishedAt");--> statement-breakpoint
CREATE INDEX "articles_author_id_idx" ON "articles" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "authors_email_idx" ON "authors" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "entities_key_uidx" ON "entities" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "languages_code_uidx" ON "languages" USING btree ("code");--> statement-breakpoint
CREATE INDEX "languages_is_active_idx" ON "languages" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "languages_is_default_idx" ON "languages" USING btree ("isDefault");--> statement-breakpoint
CREATE UNIQUE INDEX "long_text_translations_long_text_language_uidx" ON "long_text_translations" USING btree ("longTextId","languageId");--> statement-breakpoint
CREATE UNIQUE INDEX "metas_entity_model_uidx" ON "metas" USING btree ("entityId","modelId");--> statement-breakpoint
CREATE INDEX "metas_model_id_idx" ON "metas" USING btree ("modelId");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_translations_slug_language_uidx" ON "slug_translations" USING btree ("slugId","languageId");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_translations_language_content_uidx" ON "slug_translations" USING btree ("languageId","content");--> statement-breakpoint
CREATE INDEX "slug_translations_name_idx" ON "slug_translations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "slug_translations_content_idx" ON "slug_translations" USING btree ("content");--> statement-breakpoint
CREATE UNIQUE INDEX "text_translations_text_language_uidx" ON "text_translations" USING btree ("textId","languageId");--> statement-breakpoint
CREATE INDEX "text_translations_content_idx" ON "text_translations" USING btree ("content");