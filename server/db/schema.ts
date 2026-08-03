import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const messages = sqliteTable('messages', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  message: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
})
