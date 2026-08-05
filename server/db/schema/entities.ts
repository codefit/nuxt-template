import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/**
 * Polymorphic model registry — store `entityId` on related rows (e.g. metas),
 * resolve table/model name via cached `key` lookup.
 */
export const entities = pgTable(
  'entities',
  {
    id: serial().primaryKey(),
    key: text().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [uniqueIndex('entities_key_uidx').on(table.key)],
)
