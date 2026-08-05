import { getArticleBySlug } from '~~/server/services/articles/list'
import { apiError, useApiI18n } from '~~/server/utils/apiI18n'
import { parseWithParam } from '~~/server/utils/listQuery'

/**
 * Article detail by slug (any locale slug works) + slugMap for language switcher.
 * Locale: `?locale=` → i18n cookie → runtimeConfig.public.defaultLocale.
 * Relations: `?with=author`
 */
export default defineEventHandler(async (event) => {
  const { locale } = await useApiI18n(event)
  const slug = getRouterParam(event, 'slug')?.trim()
  const query = getQuery(event)
  const withRelations = parseWithParam(
    typeof query.with === 'string' ? query.with : undefined,
  )

  if (!slug) {
    apiError(event, 400, 'api.errors.missingSlug')
  }

  const article = await getArticleBySlug(slug, locale, { with: withRelations })

  if (!article) {
    apiError(event, 404, 'api.errors.articleNotFound')
  }

  return article
})
