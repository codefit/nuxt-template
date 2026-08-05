import { and, count, desc, eq, isNull, like, or, type SQL } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { db, schema } from '@nuxthub/db'
import { site } from '#shared/config/site'
import type { ArticleListItem } from '#shared/types/article'
import type { TableFilters, TableSelection } from '#shared/types/data-table'
import { requireLanguageId } from '~~/server/services/cache/languages'
import { dateRangeSql, selectionConstraintSql } from '~~/server/utils/filterSql'

export const articleNameTranslation = alias(schema.textTranslations, 'article_name_translation')
export const articleExcerptTranslation = alias(schema.textTranslations, 'article_excerpt_translation')
export const articleSlugTranslation = alias(schema.slugTranslations, 'article_slug_translation')

// --- Search / filter SQL ----------------------------------------------------

function searchSql(value: unknown): SQL | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const pattern = `%${value.trim()}%`

  return or(
    like(articleNameTranslation.content, pattern),
    like(articleSlugTranslation.content, pattern),
    like(articleExcerptTranslation.content, pattern),
  )
}

function publishedSql(value: unknown): SQL | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (value === '1' || value === 1 || value === true || value === 'true') {
    return eq(schema.articles.isPublished, 1)
  }

  if (value === '0' || value === 0 || value === false || value === 'false') {
    return eq(schema.articles.isPublished, 0)
  }

  return undefined
}

export function articleFilterSql(filters: TableFilters = {}): SQL | undefined {
  const parts = [
    isNull(schema.articles.deletedAt),
    searchSql(filters.q),
    dateRangeSql(schema.articles.createdAt, filters.createdAt),
    publishedSql(filters.isPublished),
  ].filter(Boolean) as SQL[]

  return and(...parts)
}

/** Append include / exclude id constraint to existing filter SQL. */
export function selectionSql(
  selection: TableSelection,
  filters: TableFilters = {},
): SQL | undefined {
  return selectionConstraintSql(
    schema.articles.id,
    selection,
    articleFilterSql(filters),
  )
}

function toIso(value: Date | null | undefined): string | null {
  if (!value) {
    return null
  }

  return value.toISOString()
}

/** Locale-aware article count (name + slug joins; excerpt only when searching). */
export async function countArticles(
  languageId: number,
  where: SQL | undefined,
  options: { withExcerpt?: boolean } = {},
): Promise<number> {
  const withExcerpt = Boolean(options.withExcerpt)

  const base = db
    .select({ total: count() })
    .from(schema.articles)
    .innerJoin(articleNameTranslation, and(
      eq(articleNameTranslation.textId, schema.articles.nameId),
      eq(articleNameTranslation.languageId, languageId),
    ))
    .innerJoin(articleSlugTranslation, and(
      eq(articleSlugTranslation.slugId, schema.articles.slugId),
      eq(articleSlugTranslation.languageId, languageId),
    ))

  const query = withExcerpt
    ? base
        .leftJoin(articleExcerptTranslation, and(
          eq(articleExcerptTranslation.textId, schema.articles.excerptId),
          eq(articleExcerptTranslation.languageId, languageId),
        ))
        .where(where)
    : base.where(where)

  const [row] = await query
  return row?.total ?? 0
}

/**
 * Shared article list select (public + dashboard).
 * Pass `includeAuthor` when client requests `?with=author`.
 */
export async function selectArticles(
  languageId: number,
  where: SQL | undefined,
  options: {
    orderBy: SQL
    limit?: number
    offset?: number
    includeAuthor?: boolean
  },
): Promise<ArticleListItem[]> {
  const includeAuthor = Boolean(options.includeAuthor)

  const base = {
    id: schema.articles.id,
    title: articleNameTranslation.content,
    slug: articleSlugTranslation.content,
    description: articleExcerptTranslation.content,
    isPublished: schema.articles.isPublished,
    publishedAt: schema.articles.publishedAt,
    createdAt: schema.articles.createdAt,
    updatedAt: schema.articles.updatedAt,
    archivedAt: schema.articles.archivedAt,
  }

  let query = (
    includeAuthor
      ? db
          .select({ ...base, authorName: schema.authors.name })
          .from(schema.articles)
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
            schema.authors,
            and(
              eq(schema.authors.id, schema.articles.authorId),
              isNull(schema.authors.deletedAt),
            ),
          )
      : db
          .select(base)
          .from(schema.articles)
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
  )
    .where(where)
    .orderBy(options.orderBy)
    .$dynamic()

  if (options.limit != null) {
    query = query.limit(options.limit)
  }

  if (options.offset != null) {
    query = query.offset(options.offset)
  }

  const rows = await query

  return rows
    .filter(row => Boolean(row.slug))
    .map((row) => {
      const item: ArticleListItem = {
        id: row.id,
        title: row.title,
        slug: row.slug!,
        description: row.description ?? '',
        image: site.seo.image,
        isPublished: row.isPublished === 1,
        publishedAt: toIso(row.publishedAt),
        modifiedAt: toIso(row.updatedAt) ?? undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        archivedAt: toIso(row.archivedAt),
      }

      if (includeAuthor && 'authorName' in row) {
        const name = row.authorName
        item.author = typeof name === 'string' && name ? name : undefined
      }

      return item
    })
}

/**
 * Resolve include/exclude selection against filtered articles.
 * Uses SQL id constraints — does not hydrate the full filtered table for include.
 */
export async function resolveArticleSelection(
  selection: TableSelection,
  filters: TableFilters = {},
  locale: string,
): Promise<{
  matchedTotal: number
  affected: ArticleListItem[]
}> {
  const languageId = await requireLanguageId(locale)
  const filterWhere = articleFilterSql(filters)
  const affectedWhere = selectionSql(selection, filters)
  const needsExcerpt = typeof filters.q === 'string' && Boolean(filters.q.trim())

  const [matchedTotal, affected] = await Promise.all([
    countArticles(languageId, filterWhere, { withExcerpt: needsExcerpt }),
    selectArticles(languageId, affectedWhere, {
      orderBy: desc(schema.articles.createdAt),
    }),
  ])

  return {
    matchedTotal,
    affected,
  }
}
