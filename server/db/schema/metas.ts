import { index, integer, sqliteTable, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { entities } from './entities'
import { longTexts, texts } from './i18n'

/**
 * Polymorphic SEO / long content — identify owner by `entityId` + `modelId`
 * (never by string type; resolve type via entities cache).
 */
export const metas = sqliteTable(
  'metas',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    entityId: integer()
      .notNull()
      .references(() => entities.id, { onDelete: 'cascade' }),
    modelId: integer().notNull(),
    contentLongId: integer().references(() => longTexts.id, { onDelete: 'set null' }),
    metaTitleId: integer().references(() => texts.id, { onDelete: 'set null' }),
    metaDescriptionId: integer().references(() => texts.id, { onDelete: 'set null' }),
    metaKeywordsId: integer().references(() => texts.id, { onDelete: 'set null' }),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('metas_entity_model_uidx').on(table.entityId, table.modelId),
    index('metas_model_id_idx').on(table.modelId),
  ],
)
