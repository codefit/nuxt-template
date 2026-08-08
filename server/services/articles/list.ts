import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArticleDetail, ArticleListItem } from '#shared/types/dto/article'
import type { LocaleSlugMap } from '#shared/types/i18n/localeSwitch'
import type { ResourceListQuery, ResourceListResponse } from '#shared/types/ui/resource'
import {
  articleExcerptTranslation,
  articleFilterSql,
  articleMetaDescriptionTranslation,
  articleMetaKeywordsTranslation,
  articleMetaTitleTranslation,
  articleNameTranslation,
  articleSlugTranslation,
  countArticles,
  selectArticles,
} from '~~/server/services/articles/selection'
import { requireEntityId } from '~~/server/services/cache/entities'
import { Entity } from '#shared/types/dto/entity'
import { requireLanguageId } from '~~/server/services/cache/languages'
import { getEntitySlugMap } from '~~/server/services/i18n/slugMap'
import { articleCoverUrlMap } from '~~/server/services/articles/covers'
import { listMedia } from '~~/server/services/media/list'
import { MediaCollection } from '#shared/types/media/collection'
import { mediaUrl } from '#shared/utils/mediaUrl'
import {
  listResponse,
  resolveListPagination,
  resolveSortSql,
} from '~~/server/utils/listQuery'

const SORTABLE = {
  id: schema.articles.id,
  title: articleNameTranslation.content,
  slug: articleSlugTranslation.content,
  isPublished: schema.articles.isPublished,
  publishedAt: schema.articles.publishedAt,
  createdAt: schema.articles.createdAt,
  updatedAt: schema.articles.updatedAt,
} as const

function toIso(value: Date | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  return value.toISOString()
}

function publishedIso(value: Date | null | undefined, fallback: Date): string {
  return (value ?? fallback).toISOString()
}

/**
 * Paginated article list — same ResourceListQuery as messages / DataTable.
 * Soft-deleted rows are always excluded; publish state via `filters.isPublished`.
 * Pass `with: ['author']` to include author name on each item.
 */
export async function listArticles(
  locale: string,
  input: ResourceListQuery = {},
): Promise<ResourceListResponse<ArticleListItem>> {
  const languageId = await requireLanguageId(locale)
  const pagination = resolveListPagination(input)
  const where = articleFilterSql(input.filters)
  const orderBy = resolveSortSql(SORTABLE, input.sort, {
    id: 'publishedAt',
    desc: true,
  })
  
  const includeAuthor = input.with?.includes('author') ?? false
  const needsExcerpt = typeof input.filters?.q === 'string' && Boolean(input.filters.q.trim())

  const [total, items] = await Promise.all([
    countArticles(languageId, where, { withExcerpt: needsExcerpt }),
    selectArticles(languageId, where, {
      orderBy,
      limit: pagination.limit,
      offset: pagination.offset,
      includeAuthor,
    }),
  ])

  return listResponse(items, total, pagination)
}

/**
 * Article by any-language slug; content + slugMap for the requested locale.
 * Pass `with: ['author']` to include author name.
 */
export async function getArticleBySlug(
  slug: string,
  locale: string,
  options: { with?: string[] } = {},
): Promise<ArticleDetail | null> {
  const languageId = await requireLanguageId(locale)
  const entityId = await requireEntityId(Entity.ARTICLE)
  const slugMap = await getEntitySlugMap(Entity.ARTICLE, slug)

  const includeAuthor = options.with?.includes('author') ?? false

  if (!slugMap) {
    return null
  }

  const [row] = await db
    .select({
      id: schema.articles.id,
      slug: articleSlugTranslation.content,
      title: articleNameTranslation.content,
      description: articleExcerptTranslation.content,
      metaTitle: articleMetaTitleTranslation.content,
      metaDescription: articleMetaDescriptionTranslation.content,
      metaKeywords: articleMetaKeywordsTranslation.content,
      isPublished: schema.articles.isPublished,
      publishedAt: schema.articles.publishedAt,
      updatedAt: schema.articles.updatedAt,
      createdAt: schema.articles.createdAt,
      archivedAt: schema.articles.archivedAt,
      contentLongId: schema.metas.contentLongId,
      authorName: schema.authors.name,
    })
    .from(schema.slugTranslations)
    .innerJoin(schema.articles, eq(schema.articles.slugId, schema.slugTranslations.slugId))
    .innerJoin(articleNameTranslation, and(
      eq(articleNameTranslation.textId, schema.articles.nameId),
      eq(articleNameTranslation.languageId, languageId),
    ))
    .innerJoin(articleSlugTranslation, and(
      eq(articleSlugTranslation.slugId, schema.articles.slugId),
      eq(articleSlugTranslation.languageId, languageId),
    ))
    .leftJoin(articleExcerptTranslation, and(
      eq(articleExcerptTranslation.textId, schema.articles.excerptId),
      eq(articleExcerptTranslation.languageId, languageId),
    ))
    .leftJoin(
      schema.metas,
      and(
        eq(schema.metas.entityId, entityId),
        eq(schema.metas.modelId, schema.articles.id),
      ),
    )
    .leftJoin(articleMetaTitleTranslation, and(
      eq(articleMetaTitleTranslation.textId, schema.metas.metaTitleId),
      eq(articleMetaTitleTranslation.languageId, languageId),
    ))
    .leftJoin(articleMetaDescriptionTranslation, and(
      eq(articleMetaDescriptionTranslation.textId, schema.metas.metaDescriptionId),
      eq(articleMetaDescriptionTranslation.languageId, languageId),
    ))
    .leftJoin(articleMetaKeywordsTranslation, and(
      eq(articleMetaKeywordsTranslation.textId, schema.metas.metaKeywordsId),
      eq(articleMetaKeywordsTranslation.languageId, languageId),
    ))
    .leftJoin(
      schema.authors,
      and(
        eq(schema.authors.id, schema.articles.authorId),
        isNull(schema.authors.deletedAt),
      ),
    )
    .where(
      and(
        eq(schema.slugTranslations.content, slug),
        eq(schema.articles.isPublished, 1),
        isNull(schema.articles.deletedAt),
      ),
    )
    .limit(1)

  if (!row?.slug) {
    return null
  }

  let body = ''
  if (row.contentLongId) {
    const [bodyRow] = await db
      .select({ content: schema.longTextTranslations.content })
      .from(schema.longTextTranslations)
      .where(
        and(
          eq(schema.longTextTranslations.longTextId, row.contentLongId),
          eq(schema.longTextTranslations.languageId, languageId),
        ),
      )
      .limit(1)

    body = bodyRow?.content ?? ''
  }

  const [covers, galleryRows] = await Promise.all([
    articleCoverUrlMap([row.id], 'detail'),
    listMedia(Entity.ARTICLE, row.id, MediaCollection.GALLERY),
  ])

  const gallery = galleryRows
    .map(item => mediaUrl(item))
    .filter((url): url is string => Boolean(url))

  const detail: ArticleDetail = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    metaTitle: row.metaTitle?.trim() || '',
    metaDescription: row.metaDescription?.trim() || '',
    metaKeywords: row.metaKeywords?.trim() || '',
    body,
    image: covers.get(row.id),
    gallery,
    isPublished: row.isPublished === 1,
    publishedAt: publishedIso(row.publishedAt, row.createdAt),
    modifiedAt: toIso(row.updatedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    archivedAt: row.archivedAt ? row.archivedAt.toISOString() : null,
    slugMap,
  }

  if (includeAuthor) {
    detail.author = row.authorName || undefined
  }

  return detail
}

/** All locale slugs for published articles (sitemap). */
export async function listArticleSlugEntries(): Promise<
  { code: string, slug: string, lastmod: string }[]
> {
  const rows = await db
    .select({
      code: schema.languages.code,
      slug: schema.slugTranslations.content,
      publishedAt: schema.articles.publishedAt,
      updatedAt: schema.articles.updatedAt,
      createdAt: schema.articles.createdAt,
    })
    .from(schema.articles)
    .innerJoin(schema.slugTranslations, eq(schema.slugTranslations.slugId, schema.articles.slugId))
    .innerJoin(schema.languages, eq(schema.languages.id, schema.slugTranslations.languageId))
    .where(
      and(
        eq(schema.articles.isPublished, 1),
        isNull(schema.articles.deletedAt),
        eq(schema.languages.isActive, 1),
      ),
    )

  return rows
    .filter(row => Boolean(row.slug))
    .map(row => ({
      code: row.code,
      slug: row.slug!,
      lastmod: publishedIso(row.updatedAt ?? row.publishedAt, row.createdAt).slice(0, 10),
    }))
}

export type { LocaleSlugMap }
