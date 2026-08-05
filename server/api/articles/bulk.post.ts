import type { ResourceBulkBody } from '#shared/types/resource'
import {
  isArticleBulkAction,
  runArticleBulk,
  type ArticleBulkAction,
} from '~~/server/services/articles/bulk'
import { apiError, useApiI18n } from '~~/server/utils/apiI18n'
import { readBulkFilters, readBulkSelection } from '~~/server/utils/bulkBody'

/**
 * POST /api/articles/bulk — mutate selected articles (or export preview).
 */
export default defineEventHandler(async (event) => {
  const { locale } = await useApiI18n(event)
  const body = await readBody<ResourceBulkBody>(event)
  const action = body?.action?.trim()

  if (!action || !isArticleBulkAction(action)) {
    apiError(event, 400, 'api.errors.bulkUnknownAction')
  }

  return runArticleBulk({
    action: action as ArticleBulkAction,
    selection: readBulkSelection(event, body),
    filters: readBulkFilters(body),
    locale,
  })
})
