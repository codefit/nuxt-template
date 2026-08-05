import { updateArticle } from '~~/server/services/articles/update'
import { articleFormSchema } from '~~/server/services/articles/schema'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidArticleId')
  }

  const body = await readValidatedBody(event, (data) => {
    const parsed = articleFormSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: parsed.error.issues[0]?.message ?? 'Invalid body',
      })
    }
    return parsed.data
  })

  try {
    return await updateArticle(id, body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.articleUpdateFailed')
  }
})
