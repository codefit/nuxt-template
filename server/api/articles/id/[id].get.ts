import { getArticleById } from '~~/server/services/articles/getById'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidArticleId')
  }

  const article = await getArticleById(id)
  if (!article) {
    apiError(event, 404, 'api.errors.articleNotFound')
  }

  return article
})
