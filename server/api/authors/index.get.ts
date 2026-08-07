import { listAuthors } from '~~/server/services/authors/list'
import { readListQuery } from '~~/server/utils/listQuery'

/**
 * GET /api/authors — paginated admin list.
 */
export default defineEventHandler(async (event) => {
  const query = readListQuery(event, ['createdAt'])

  return await listAuthors(query)
})
