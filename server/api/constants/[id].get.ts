import { getConstantById } from '~~/server/services/constants/getById'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * GET /api/constants/:id — admin detail.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidConstantId')
  }

  const item = await getConstantById(id)
  if (!item) {
    apiError(event, 404, 'api.errors.constantNotFound')
  }

  return item
})
