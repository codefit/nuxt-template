import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const languages = pgTable(
  'languages',
  {
    id: serial().primaryKey(),
    code: text().notNull(),
    name: text().notNull(),
    icon: text(),
    isActive: integer().notNull().default(1),
    isDefault: integer().notNull().default(0),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('languages_code_uidx').on(table.code),
    index('languages_is_active_idx').on(table.isActive),
    index('languages_is_default_idx').on(table.isDefault),
  ],
)

/** Identity row for short translatable strings (name, excerpt, meta…). */
export const texts = pgTable('texts', {
  id: serial().primaryKey(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const textTranslations = pgTable(
  'text_translations',
  {
    id: serial().primaryKey(),
    textId: integer()
      .notNull()
      .references(() => texts.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('text_translations_text_language_uidx').on(table.textId, table.languageId),
    index('text_translations_content_idx').on(table.content),
  ],
)

/** Identity row for long HTML / markdown bodies. */
export const longTexts = pgTable('long_texts', {
  id: serial().primaryKey(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const longTextTranslations = pgTable(
  'long_text_translations',
  {
    id: serial().primaryKey(),
    longTextId: integer()
      .notNull()
      .references(() => longTexts.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('long_text_translations_long_text_language_uidx').on(
      table.longTextId,
      table.languageId,
    ),
  ],
)

/** Identity row for URL slugs. */
export const slugs = pgTable('slugs', {
  id: serial().primaryKey(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const slugTranslations = pgTable(
  'slug_translations',
  {
    id: serial().primaryKey(),
    slugId: integer()
      .notNull()
      .references(() => slugs.id, { onDelete: 'cascade' }),
    languageId: integer()
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    content: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  table => [
    uniqueIndex('slug_translations_slug_language_uidx').on(table.slugId, table.languageId),
    uniqueIndex('slug_translations_language_content_uidx').on(table.languageId, table.content),
    index('slug_translations_name_idx').on(table.name),
    index('slug_translations_content_idx').on(table.content),
  ],
)
