import type { LocaleSlugMap } from '#shared/types/i18n/localeSwitch'
import type { PendingMedia } from '#shared/types/ui/form'

/** Shared article list row (public cards + dashboard table). */
export interface ArticleListItem {
  id: number
  slug: string
  title: string
  image?: string
  author?: string
  description: string
  createdAt: string
  updatedAt: string
  modifiedAt?: string
  isPublished: boolean
  archivedAt: string | null
  publishedAt: string | null
}

/** Article detail — includes locale slug map for language switcher (no extra request). */
export interface ArticleDetail extends Omit<ArticleListItem, 'publishedAt'> {
  body: string
  publishedAt: string
  slugMap: LocaleSlugMap
}

/** Per-locale fields stored in texts / slugs / long_texts / metas. */
export interface ArticleLocaleInput {
  body: string
  slug: string
  title: string
  excerpt: string
  metaTitle: string
  metaKeywords: string
  metaDescription: string
}

/** Locale-keyed map — omit empty locales (except default, which is required). */
export type ArticleTranslations = Record<string, ArticleLocaleInput>

/** Shared (non-translated) article fields. */
export interface ArticleSharedInput {
  authorId: number | null
  isPublished: boolean
  publishedAt: string | null
}

/** Create / update body from dashboard form. */
export interface ArticleFormInput extends ArticleSharedInput {
  media?: PendingMedia[]
  translations: ArticleTranslations
}

/** Admin detail for edit / copy forms (all locales). */
export interface ArticleAdminDetail extends ArticleSharedInput {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  archivedAt: string | null
  translations: ArticleTranslations
}
