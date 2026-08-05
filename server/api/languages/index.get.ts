import type { LanguageOption } from '#shared/types/language'
import { getActiveLanguages } from '~~/server/services/cache/languages'

/**
 * Active languages for UI (header switcher) — icons stored on `languages.icon`.
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
