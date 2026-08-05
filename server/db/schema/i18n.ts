import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const languages = sqliteTable(
  'languages',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    code: text().notNull(),
    name: text().notNull(),
    icon: text(),
    isActive: integer().notNull().default(1),
    isDefault: integer().notNull().default(0),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('languages_code_uidx').on(table.code),
    index('languages_is_active_idx').on(table.isActive),
    index('languages_is_default_idx').on(table.isDefault),
  ],
)

/** Identity row for short translatable strings (name, excerpt, meta…). */
export const texts = sqliteTable('texts', {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
})

export const textTranslations = sqliteTable(
  'text_translations',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    textId: integer()
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('text_translations_text_language_uidx').on(table.textId, table.languageId),
    index('text_translations_content_idx').on(table.content),
  ],
)

/** Identity row for long HTML / markdown bodies. */
export const longTexts = sqliteTable('long_texts', {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
})

export const longTextTranslations = sqliteTable(
  'long_text_translations',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    longTextId: integer()
      .notNull()
      .references(() => longTexts.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('long_text_translations_long_text_language_uidx').on(
      table.longTextId,
      table.languageId,
    ),
  ],
)

/** Identity row for URL slugs. */
export const slugs = sqliteTable('slugs', {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
})

export const slugTranslations = sqliteTable(
  'slug_translations',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    slugId: integer()
      .notNull()
      .references(() => slugs.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    content: text(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('slug_translations_slug_language_uidx').on(table.slugId, table.languageId),
    uniqueIndex('slug_translations_language_content_uidx').on(table.languageId, table.content),
    index('slug_translations_name_idx').on(table.name),
    index('slug_translations_content_idx').on(table.content),
  ],
)
