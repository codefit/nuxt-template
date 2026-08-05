import { isEntityKey } from '#shared/types/dto/entity'
import { getEntitySlugMap, hasSlugEntity } from '~~/server/services/i18n/slugMap'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * Locale → URL slug map for a translable entity (lookup by any language slug).
 * Register new owners in `server/services/i18n/slugMap.ts` → `SLUG_TABLES`.
 */
export default defineEventHandler(async (event) => {
  const entityParam = getRouterParam(event, 'entity')?.trim()
  const slug = getRouterParam(event, 'slug')?.trim()

  if (!entityParam || !slug) {
    apiError(event, 400, 'api.errors.missingEntityOrSlug')
  }

  if (!isEntityKey(entityParam) || !hasSlugEntity(entityParam)) {
    apiError(event, 404, 'api.errors.entityNoSlugMap', { entity: entityParam })
  }

  const map = await getEntitySlugMap(entityParam, slug)

  if (!map) {
    apiError(event, 404, 'api.errors.slugNotFound')
  }

  return map
})
