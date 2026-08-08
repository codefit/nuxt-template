import { updateConstant } from '~~/server/services/constants/update'
import { constantUpdateSchema } from '~~/server/services/constants/schema'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * PATCH /api/constants/:id — update constant (`key` immutable).
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidConstantId')
  }

  const body = await readValidatedBody(event, (data) => {
    const parsed = constantUpdateSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: parsed.error.issues[0]?.message ?? 'Invalid body',
      })
    }
    return parsed.data
  })

  try {
    return await updateConstant(id, body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.constantUpdateFailed')
  }
})
