import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Site settings / constants — keyed values grouped for dashboard UI.
 * Client cache exposes only active + non-private rows.
 */
export const constants = pgTable(
  'constants',
  {
    id: serial().primaryKey(),
    group: text().notNull(),
    key: text().notNull(),
    type: text().notNull().default('text'),
    value: text().notNull().default(''),
    label: text().notNull(),
    description: text(),
    isActive: integer().notNull().default(1),
    isPrivate: integer().notNull().default(0),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('constants_key_uidx').on(table.key),
    index('constants_group_idx').on(table.group),
    index('constants_is_active_idx').on(table.isActive),
    index('constants_is_private_idx').on(table.isPrivate),
  ],
)
