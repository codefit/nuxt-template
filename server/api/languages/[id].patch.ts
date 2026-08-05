import { updateLanguage } from '~~/server/services/languages/update'
import { languageFormSchema } from '~~/server/services/languages/schema'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * PATCH /api/languages/:id — update language (no create endpoint).
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidLanguageId')
  }

  const body = await readValidatedBody(event, (data) => {
    const parsed = languageFormSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: parsed.error.issues[0]?.message ?? 'Invalid body',
      })
    }
    return parsed.data
  })

  try {
    return await updateLanguage(id, body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.languageUpdateFailed')
  }
})
