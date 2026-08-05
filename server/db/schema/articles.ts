import { index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { authors } from './authors'
import { slugs, texts } from './i18n'

export const articles = pgTable(
  'articles',
  {
    id: serial().primaryKey(),
    nameId: integer()
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    slugId: integer()
      .notNull()
      .references(() => slugs.id, { onDelete: 'cascade' }),
    excerptId: integer().references(() => texts.id, { onDelete: 'cascade' }),
    authorId: integer().references(() => authors.id, { onDelete: 'set null' }),
    isPublished: integer().notNull().default(1),
    publishedAt: timestamp(),
    archivedAt: timestamp(),
    deletedAt: timestamp(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    index('articles_is_published_idx').on(table.isPublished),
    index('articles_published_at_idx').on(table.publishedAt),
    index('articles_author_id_idx').on(table.authorId),
  ],
)
