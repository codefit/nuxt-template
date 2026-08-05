import type { ResourceBulkBody } from '#shared/types/resource'
import {
  isMessageBulkAction,
  runMessageBulk,
  type MessageBulkAction,
} from '~~/server/services/messages/bulk'
import { apiError } from '~~/server/utils/apiI18n'
import { readBulkFilters, readBulkSelection } from '~~/server/utils/bulkBody'

/**
 * POST /api/messages/bulk — mutate selected messages (or export preview).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ResourceBulkBody>(event)
  const action = body?.action?.trim()

  if (!action || !isMessageBulkAction(action)) {
    apiError(event, 400, 'api.errors.bulkUnknownAction')
  }

  return runMessageBulk({
    action: action as MessageBulkAction,
    selection: readBulkSelection(event, body),
    filters: readBulkFilters(body),
  })
})
