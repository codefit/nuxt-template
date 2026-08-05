import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Authors — non-translated raw identity (name is the same in every locale).
 */
export const authors = pgTable(
  'authors',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text(),
    phone: text(),
    deletedAt: timestamp(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    index('authors_name_idx').on(table.name),
    index('authors_email_idx').on(table.email),
  ],
)
