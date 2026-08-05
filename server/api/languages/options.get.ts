import type { LanguageOption } from '#shared/types/dto/language'
import { getActiveLanguages } from '~~/server/services/cache/languages'

/**
 * GET /api/languages/options — active languages for UI switchers.
 */
export default defineEventHandler(async (): Promise<LanguageOption[]> => {
  const rows = await getActiveLanguages()

  return rows.map(row => ({
    code: row.code,
    name: row.name,
    icon: row.icon,
    isDefault: row.isDefault === 1,
  }))
})
