import { createConstant } from '~~/server/services/constants/create'
import { constantFormSchema } from '~~/server/services/constants/schema'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * POST /api/constants — create constant.
 */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    const parsed = constantFormSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: parsed.error.issues[0]?.message ?? 'Invalid body',
      })
    }
    return parsed.data
  })

  try {
    return await createConstant(body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.constantCreateFailed')
  }
})
