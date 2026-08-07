import { listAuthorOptions } from '~~/server/services/authors/options'

/**
 * GET /api/authors/options — autocomplete for author pickers.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q : undefined
  return listAuthorOptions(q)
})
