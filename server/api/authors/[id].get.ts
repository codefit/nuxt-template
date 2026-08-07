import { getAuthorById } from '~~/server/services/authors/getById'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * GET /api/authors/:id — admin detail.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidAuthorId')
  }

  const author = await getAuthorById(id)
  if (!author) {
    apiError(event, 404, 'api.errors.authorNotFound')
  }

  return author
})
