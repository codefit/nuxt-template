import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Authors — non-translated raw identity (name is the same in every locale).
 */
export const authors = sqliteTable(
  'authors',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text(),
    phone: text(),
    deletedAt: integer({ mode: 'timestamp' }),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    index('authors_name_idx').on(table.name),
    index('authors_email_idx').on(table.email),
  ],
)
