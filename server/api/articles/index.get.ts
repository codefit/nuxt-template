import { listArticles } from '~~/server/services/articles/list'
import { useApiI18n } from '~~/server/utils/apiI18n'
import { readListQuery } from '~~/server/utils/listQuery'

/**
 * GET /api/articles — paginated list (page + limit → offset).
 * Locale: `?locale=` → i18n cookie → defaultLocale.
 * Filters: `q`, `createdAt`, `isPublished`, …
 * Relations: `?with=author`
 */
export default defineEventHandler(async (event) => {
  const { locale } = await useApiI18n(event)
  const query = readListQuery(event, ['createdAt', 'isPublished'])

  return await listArticles(locale, query)
})
