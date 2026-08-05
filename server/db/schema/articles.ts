import { index, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { authors } from './authors'
import { slugs, texts } from './i18n'

export const articles = sqliteTable(
  'articles',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    nameId: integer()
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    slugId: integer()
      .notNull()
      .references(() => slugs.id, { onDelete: 'cascade' }),
    excerptId: integer().references(() => texts.id, { onDelete: 'cascade' }),
    authorId: integer().references(() => authors.id, { onDelete: 'set null' }),
    isPublished: integer().notNull().default(1),
    publishedAt: integer({ mode: 'timestamp' }),
    archivedAt: integer({ mode: 'timestamp' }),
    deletedAt: integer({ mode: 'timestamp' }),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    index('articles_is_published_idx').on(table.isPublished),
    index('articles_published_at_idx').on(table.publishedAt),
    index('articles_author_id_idx').on(table.authorId),
  ],
)
