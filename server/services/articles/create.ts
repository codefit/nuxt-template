import { db, schema } from '@nuxthub/db'
import type { ArticleAdminDetail } from '#shared/types/article'
import { localeFilled } from '#shared/utils/translations'
import {
  assertArticleTranslations,
  type ArticleFormParsed,
} from '~~/server/services/articles/schema'
import { getArticleById, requireDefaultCode, resolveUniqueSlugs } from '~~/server/services/articles/getById'
import { createLongText, createSlug, createText } from '~~/server/services/i18n/content'
import { requireEntityId } from '~~/server/services/cache/entities'
import { getActiveLanguages } from '~~/server/services/cache/languages'

function stamp(): Date {
  return new Date()
}

/**
 * Create article + i18n texts/slugs/long texts + metas.
 * Media is accepted in the payload but not persisted yet.
 */
export async function createArticle(input: ArticleFormParsed): Promise<ArticleAdminDetail> {
  const defaultCode = await requireDefaultCode()
  assertArticleTranslations(input.translations, defaultCode)

  const translations = await resolveUniqueSlugs(input.translations)
  const languages = await getActiveLanguages()
  const byCode = Object.fromEntries(languages.map(lang => [lang.code, lang.id]))

  const textRows: { languageId: number, content: string }[] = []
  const excerptRows: { languageId: number, content: string }[] = []
  const slugRows: { languageId: number, name: string, content: string }[] = []
  const bodyRows: { languageId: number, content: string }[] = []
  const metaTitleRows: { languageId: number, content: string }[] = []
  const metaDescRows: { languageId: number, content: string }[] = []
  const metaKeyRows: { languageId: number, content: string }[] = []

  for (const [code, locale] of Object.entries(translations)) {
    if (!localeFilled(locale) && code !== defaultCode) {
      continue
    }
    const languageId = byCode[code]
    if (!languageId) {
      continue
    }

    textRows.push({ languageId, content: locale.title.trim() })
    excerptRows.push({ languageId, content: locale.excerpt.trim() })
    slugRows.push({
      languageId,
      name: locale.title.trim(),
      content: locale.slug.trim(),
    })
    bodyRows.push({ languageId, content: locale.body })
    metaTitleRows.push({ languageId, content: locale.metaTitle.trim() })
    metaDescRows.push({ languageId, content: locale.metaDescription.trim() })
    if (locale.metaKeywords.trim()) {
      metaKeyRows.push({ languageId, content: locale.metaKeywords.trim() })
    }
  }

  const now = stamp()
  const nameId = await createText(textRows)
  const excerptId = await createText(excerptRows)
  const slugId = await createSlug(slugRows)
  const contentLongId = await createLongText(bodyRows)
  const metaTitleId = await createText(metaTitleRows)
  const metaDescriptionId = await createText(metaDescRows)
  const metaKeywordsId = metaKeyRows.length ? await createText(metaKeyRows) : null

  const [article] = await db
    .insert(schema.articles)
    .values({
      nameId,
      slugId,
      excerptId,
      authorId: input.authorId,
      isPublished: input.isPublished ? 1 : 0,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  if (!article) {
    throw createError({ statusCode: 500, message: 'Article insert failed.' })
  }

  const entityId = await requireEntityId('article')
  await db.insert(schema.metas).values({
    entityId,
    modelId: article.id,
    contentLongId,
    metaTitleId,
    metaDescriptionId,
    metaKeywordsId,
    createdAt: now,
    updatedAt: now,
  })

  // Media intentionally ignored until upload storage is chosen.
  void input.media

  const detail = await getArticleById(article.id)
  if (!detail) {
    throw createError({ statusCode: 500, message: 'Article was created but could not be loaded.' })
  }
  return detail
}
