import type { LocaleSlugMap } from '#shared/types/localeSwitch'
import type { PendingMedia } from '#shared/types/form'

/** Shared article list row (public cards + dashboard table). */
export interface ArticleListItem {
  id: number
  slug: string
  title: string
  description: string
  image?: string
  author?: string
  /** Intentional publish flag (independent of schedule date). */
  isPublished: boolean
  /** Planned / actual publish date; independent of isPublished. */
  publishedAt: string | null
  modifiedAt?: string
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

/** Article detail — includes locale slug map for language switcher (no extra request). */
export interface ArticleDetail extends Omit<ArticleListItem, 'publishedAt'> {
  /** HTML body */
  body: string
  /** Always set on detail (falls back to createdAt). */
  publishedAt: string
  slugMap: LocaleSlugMap
}

/** Per-locale fields stored in texts / slugs / long_texts / metas. */
export interface ArticleLocaleInput {
  title: string
  slug: string
  excerpt: string
  body: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

/** Locale-keyed map — omit empty locales (except default, which is required). */
export type ArticleTranslations = Record<string, ArticleLocaleInput>

/** Shared (non-translated) article fields. */
export interface ArticleSharedInput {
  isPublished: boolean
  publishedAt: string | null
  authorId: number | null
}

/** Create / update body from dashboard form. */
export interface ArticleFormInput extends ArticleSharedInput {
  translations: ArticleTranslations
  /** Prepared media metadata — upload pipeline TBD. */
  media?: PendingMedia[]
}

/** Admin detail for edit / copy forms (all locales). */
export interface ArticleAdminDetail extends ArticleSharedInput {
  id: number
  translations: ArticleTranslations
  createdAt: string
  updatedAt: string
  archivedAt: string | null
  deletedAt: string | null
}
