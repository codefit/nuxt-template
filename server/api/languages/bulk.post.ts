import type { ResourceBulkBody } from '#shared/types/resource'
import {
  isLanguageBulkAction,
  runLanguageBulk,
  type LanguageBulkAction,
} from '~~/server/services/languages/bulk'
import { apiError } from '~~/server/utils/apiI18n'
import { readBulkFilters, readBulkSelection } from '~~/server/utils/bulkBody'

/**
 * POST /api/languages/bulk — activate / deactivate / export.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ResourceBulkBody>(event)
  const action = body?.action?.trim()

  if (!action || !isLanguageBulkAction(action)) {
    apiError(event, 400, 'api.errors.bulkUnknownAction')
  }

  return runLanguageBulk({
    action: action as LanguageBulkAction,
    selection: readBulkSelection(event, body),
    filters: readBulkFilters(body),
  })
})
