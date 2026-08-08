import { deleteConstant } from '~~/server/services/constants/delete'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * DELETE /api/constants/:id — hard delete.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidConstantId')
  }

  try {
    return await deleteConstant(id)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.constantDeleteFailed')
  }
})
