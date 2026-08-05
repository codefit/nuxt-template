import { listLanguages } from '~~/server/services/languages/list'
import { readListQuery } from '~~/server/utils/listQuery'

/**
 * GET /api/languages — paginated admin list.
 */
export default defineEventHandler(async (event) => {
  const query = readListQuery(event, ['createdAt', 'isActive', 'isDefault'])

  return await listLanguages(query)
})
