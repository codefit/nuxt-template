import type { Language } from '#shared/types/db'
import type { LanguageAdminDetail, LanguageListItem } from '#shared/types/language'

function toIso(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return new Date(value).toISOString()
}

/** Map DB language row to admin/list DTO. */
export function mapLanguage(row: Language): LanguageListItem {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    icon: row.icon,
    isActive: row.isActive === 1,
    isDefault: row.isDefault === 1,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  }
}

export function mapLanguageDetail(row: Language): LanguageAdminDetail {
  return mapLanguage(row)
}
