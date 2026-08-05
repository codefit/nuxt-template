import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArticleAdminDetail } from '#shared/types/article'
import { localeFilled } from '#shared/utils/translations'
import {
  assertArticleTranslations,
  type ArticleFormParsed,
} from '~~/server/services/articles/schema'
import { getArticleById, requireDefaultCode, resolveUniqueSlugs } from '~~/server/services/articles/getById'
import { syncLongText, syncSlug, syncText } from '~~/server/services/i18n/content'
import { requireEntityId } from '~~/server/services/cache/entities'
import { getActiveLanguages } from '~~/server/services/cache/languages'

function stamp(): Date {
  return new Date()
}

export async function updateArticle(
  id: number,
  input: ArticleFormParsed,
): Promise<ArticleAdminDetail> {
  const defaultCode = await requireDefaultCode()
  assertArticleTranslations(input.translations, defaultCode)

  const [row] = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.id, id), isNull(schema.articles.deletedAt)))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Article not found.' })
  }

  const translations = await resolveUniqueSlugs(input.translations, row.slugId)
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

  await syncText(row.nameId, textRows)
  await syncText(row.excerptId, excerptRows)
  await syncSlug(row.slugId, slugRows)

  const entityId = await requireEntityId('article')
  const [meta] = await db
    .select()
    .from(schema.metas)
    .where(and(eq(schema.metas.entityId, entityId), eq(schema.metas.modelId, id)))
    .limit(1)

  const now = stamp()
  const contentLongId = await syncLongText(meta?.contentLongId, bodyRows)
  const metaTitleId = await syncText(meta?.metaTitleId, metaTitleRows)
  const metaDescriptionId = await syncText(meta?.metaDescriptionId, metaDescRows)
  const metaKeywordsId = metaKeyRows.length
    ? await syncText(meta?.metaKeywordsId, metaKeyRows)
    : meta?.metaKeywordsId ?? null

  if (meta) {
    await db
      .update(schema.metas)
      .set({
        contentLongId,
        metaTitleId,
        metaDescriptionId,
        metaKeywordsId,
        updatedAt: now,
      })
      .where(eq(schema.metas.id, meta.id))
  }
  else {
    await db.insert(schema.metas).values({
      entityId,
      modelId: id,
      contentLongId,
      metaTitleId,
      metaDescriptionId,
      metaKeywordsId,
      createdAt: now,
      updatedAt: now,
    })
  }

  await db
    .update(schema.articles)
    .set({
      authorId: input.authorId,
      isPublished: input.isPublished ? 1 : 0,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      updatedAt: now,
    })
    .where(eq(schema.articles.id, id))

  void input.media

  const detail = await getArticleById(id)
  if (!detail) {
    throw createError({ statusCode: 500, message: 'Article was updated but could not be loaded.' })
  }
  return detail
}
