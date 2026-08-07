import { updateAuthor } from '~~/server/services/authors/update'
import { authorFormSchema } from '~~/server/services/authors/schema'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * PATCH /api/authors/:id — update author.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidAuthorId')
  }

  const body = await readValidatedBody(event, (data) => {
    const parsed = authorFormSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: parsed.error.issues[0]?.message ?? 'Invalid body',
      })
    }
    return parsed.data
  })

  try {
    return await updateAuthor(id, body)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    apiError(event, 500, 'api.errors.authorUpdateFailed')
  }
})
