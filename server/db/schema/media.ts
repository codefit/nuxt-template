import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { entities } from './entities'

/**
 * Polymorphic media owned by any entity (`entityId` + `modelId`).
 * `collection` is a MediaCollection value; `rank` orders gallery items.
 * Display sizes come from shared media config + Nuxt Image (IPX / Cloudflare).
 */
export const media = pgTable(
  'media',
  {
    id: serial().primaryKey(),
    entityId: integer()
      .notNull()
      .references(() => entities.id, { onDelete: 'cascade' }),
    modelId: integer().notNull(),
    collection: text().notNull(),
    fileType: text().notNull(),
    pathname: text().notNull(),
    url: text(),
    mime: text().notNull(),
    name: text().notNull(),
    size: integer().notNull(),
    width: integer(),
    height: integer(),
    alt: text(),
    rank: integer().notNull().default(0),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    index('media_entity_model_idx').on(table.entityId, table.modelId),
    index('media_entity_model_collection_idx').on(
      table.entityId,
      table.modelId,
      table.collection,
    ),
    index('media_rank_idx').on(table.entityId, table.modelId, table.collection, table.rank),
  ],
)
