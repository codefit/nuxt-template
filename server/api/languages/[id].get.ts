import { getLanguageById } from '~~/server/services/languages/getById'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * GET /api/languages/:id — admin detail.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidLanguageId')
  }

  const language = await getLanguageById(id)
  if (!language) {
    apiError(event, 404, 'api.errors.languageNotFound')
  }

  return language
})
