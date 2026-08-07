import type { ResourceBulkBody } from '#shared/types/ui/resource'
import {
  isAuthorBulkAction,
  runAuthorBulk,
  type AuthorBulkAction,
} from '~~/server/services/authors/bulk'
import { apiError } from '~~/server/utils/apiI18n'
import { readBulkFilters, readBulkSelection } from '~~/server/utils/bulkBody'

/**
 * POST /api/authors/bulk — export / soft-delete.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ResourceBulkBody>(event)
  const action = body?.action?.trim()

  if (!action || !isAuthorBulkAction(action)) {
    apiError(event, 400, 'api.errors.bulkUnknownAction')
  }

  return runAuthorBulk({
    action: action as AuthorBulkAction,
    selection: readBulkSelection(event, body),
    filters: readBulkFilters(body),
  })
})
