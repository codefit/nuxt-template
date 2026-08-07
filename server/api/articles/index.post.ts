import { createArticle } from '~~/server/services/articles/create'
import { getAuthorById } from '~~/server/services/authors/getById'
import { articleFormSchema } from '~~/server/services/articles/schema'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
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

  if (body.authorId) {
    const author = await getAuthorById(body.authorId)
    if (!author) {
      apiError(event, 400, 'api.errors.authorNotFound')
    }
  }

  try {
    return await createArticle(body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.articleCreateFailed')
  }
})
