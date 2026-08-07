import type {
  articles,
  authors,
  entities,
  languages,
  longTextTranslations,
  longTexts,
  messages,
  metas,
  slugTranslations,
  slugs,
  textTranslations,
  texts,
  users,
} from '@nuxthub/db/schema'

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type MessageForm = Pick<NewMessage, 'name' | 'email' | 'message'>

export type Language = typeof languages.$inferSelect
export type NewLanguage = typeof languages.$inferInsert

export type Entity = typeof entities.$inferSelect
export type NewEntity = typeof entities.$inferInsert

export type Text = typeof texts.$inferSelect
export type TextTranslation = typeof textTranslations.$inferSelect
export type LongText = typeof longTexts.$inferSelect
export type LongTextTranslation = typeof longTextTranslations.$inferSelect
export type Slug = typeof slugs.$inferSelect
export type SlugTranslation = typeof slugTranslations.$inferSelect

export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert

export type Author = typeof authors.$inferSelect
export type NewAuthor = typeof authors.$inferInsert

export type Meta = typeof metas.$inferSelect
export type NewMeta = typeof metas.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
