import { index, integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { entities } from './entities'
import { longTexts, texts } from './i18n'

/**
 * Polymorphic SEO / long content — identify owner by `entityId` + `modelId`
 * (never by string type; resolve type via entities cache).
 */
export const metas = pgTable(
  'metas',
  {
    id: serial().primaryKey(),
    entityId: integer()
      .notNull()
      .references(() => entities.id, { onDelete: 'cascade' }),
    modelId: integer().notNull(),
    contentLongId: integer().references(() => longTexts.id, { onDelete: 'set null' }),
    metaTitleId: integer().references(() => texts.id, { onDelete: 'set null' }),
    metaDescriptionId: integer().references(() => texts.id, { onDelete: 'set null' }),
    metaKeywordsId: integer().references(() => texts.id, { onDelete: 'set null' }),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('metas_entity_model_uidx').on(table.entityId, table.modelId),
    index('metas_model_id_idx').on(table.modelId),
  ],
)
