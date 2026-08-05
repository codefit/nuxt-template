import type { ArticleListItem } from '#shared/types/article'
import { PUBLIC_ARTICLE_LIMIT } from '#shared/types/resource'

interface Options {
  /** 1-based page (URL / UPagination). Defaults to 1. */
  page?: MaybeRefOrGetter<number>
  limit?: number
  /** Prefix for useAsyncData key (e.g. `home-insights`). */
  key?: string
  withAuthor?: boolean
}

/**
 * Paginated published articles via shared GET /api/articles.
 */
export function useArticlesList(options: Options = {}) {
  return useList<ArticleListItem>({
    endpoint: '/api/articles',
    key: options.key ?? 'articles',
    page: options.page,
    limit: options.limit ?? PUBLIC_ARTICLE_LIMIT,
    query: {
      isPublished: '1',
      sort: '-publishedAt',
      ...(options.withAuthor ? { with: 'author' } : {}),
    },
  })
}
