import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

/**
 * Polymorphic model registry — store `entityId` on related rows (e.g. metas),
 * resolve table/model name via cached `key` lookup.
 */
export const entities = sqliteTable(
  'entities',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    key: text().notNull(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [uniqueIndex('entities_key_uidx').on(table.key)],
)
