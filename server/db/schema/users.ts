import { index, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/**
 * Dashboard users — email/password auth (nuxt-auth-utils session cookie).
 */
export const users = pgTable(
  'users',
  {
    id: serial().primaryKey(),
    email: text().notNull(),
    passwordHash: text().notNull(),
    name: text().notNull(),
    role: text().notNull().default('admin'),
    resetToken: text(),
    resetExpiresAt: timestamp(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('users_email_uidx').on(table.email),
    index('users_reset_token_idx').on(table.resetToken),
  ],
)
