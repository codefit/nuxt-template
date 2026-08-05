import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArticleAdminDetail, ArticleLocaleInput, ArticleTranslations } from '#shared/types/article'
import { ensureUniqueSlug, slugify } from '#shared/utils/slug'
import { localeFilled } from '#shared/utils/translations'
import {
  listSlugContents,
  loadLongTextMaps,
  loadSlugMaps,
  loadTextMaps,
} from '~~/server/services/i18n/content'
import { requireEntityId } from '~~/server/services/cache/entities'
import { getActiveLanguages, getDefaultLanguage } from '~~/server/services/cache/languages'

function toIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null
}

/**
 * Admin article detail with all locale translations (including drafts).
 */
export async function getArticleById(id: number): Promise<ArticleAdminDetail | null> {
  const [row] = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .limit(1)

  if (!row) {
    return null
  }

  const entityId = await requireEntityId('article')
  const [meta] = await db
    .select()
    .from(schema.metas)
    .where(and(eq(schema.metas.entityId, entityId), eq(schema.metas.modelId, id)))
    .limit(1)

  const [languages, textMaps, slugMaps, longMaps] = await Promise.all([
    getActiveLanguages(),
    loadTextMaps([
      row.nameId,
      row.excerptId,
      meta?.metaTitleId,
      meta?.metaDescriptionId,
      meta?.metaKeywordsId,
    ]),
    loadSlugMaps([row.slugId]),
    loadLongTextMaps([meta?.contentLongId]),
  ])

  const titles = (row.nameId && textMaps[row.nameId]) || {}
  const excerpts = (row.excerptId && textMaps[row.excerptId]) || {}
  const slugs = (row.slugId && slugMaps[row.slugId]) || {}
  const bodies = (meta?.contentLongId && longMaps[meta.contentLongId]) || {}
  const metaTitles = (meta?.metaTitleId && textMaps[meta.metaTitleId]) || {}
  const metaDescriptions = (meta?.metaDescriptionId && textMaps[meta.metaDescriptionId]) || {}
  const metaKeywords = (meta?.metaKeywordsId && textMaps[meta.metaKeywordsId]) || {}

  const translations: ArticleTranslations = {}

  for (const lang of languages) {
    const title = titles[lang.id] ?? ''
    const slug = slugs[lang.id]?.content ?? ''
    const excerpt = excerpts[lang.id] ?? ''
    const body = bodies[lang.id] ?? ''
    const metaTitle = metaTitles[lang.id] ?? ''
    const metaDescription = metaDescriptions[lang.id] ?? ''
    const keywords = metaKeywords[lang.id] ?? ''

    const locale: ArticleLocaleInput = {
      title,
      slug,
      excerpt,
      body,
      metaTitle,
      metaDescription,
      metaKeywords: keywords,
    }

    if (localeFilled(locale) || lang.isDefault === 1) {
      translations[lang.code] = locale
    }
  }

  return {
    id: row.id,
    isPublished: row.isPublished === 1,
    publishedAt: toIso(row.publishedAt),
    authorId: row.authorId ?? null,
    translations,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    archivedAt: toIso(row.archivedAt),
    deletedAt: toIso(row.deletedAt),
  }
}

export async function resolveUniqueSlugs(
  translations: ArticleTranslations,
  excludeSlugId?: number | null,
): Promise<ArticleTranslations> {
  const languages = await getActiveLanguages()
  const byCode = Object.fromEntries(languages.map(lang => [lang.code, lang]))
  const result: ArticleTranslations = { ...translations }

  for (const [code, locale] of Object.entries(translations)) {
    if (!localeFilled(locale)) {
      continue
    }
    const lang = byCode[code]
    if (!lang) {
      continue
    }
    const candidate = slugify(locale.slug || locale.title)
    const taken = await listSlugContents(lang.id, candidate, excludeSlugId)
    result[code] = {
      ...locale,
      slug: ensureUniqueSlug(candidate, taken, undefined),
    }
  }

  return result
}

export async function requireDefaultCode(): Promise<string> {
  const language = await getDefaultLanguage()
  return language.code
}
