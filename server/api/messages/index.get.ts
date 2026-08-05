import { listMessages } from '~~/server/services/messages/list'
import { readListQuery } from '~~/server/utils/listQuery'

/**
 * GET /api/messages — paginated list (page + limit → offset).
 */
export default defineEventHandler(async (event) => {
  const query = readListQuery(event, ['createdAt'])

  return await listMessages(query)
})
