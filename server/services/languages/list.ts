import { count } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { LanguageListItem } from '#shared/types/language'
import type { ResourceListQuery, ResourceListResponse } from '#shared/types/resource'
import { mapLanguage } from '~~/server/services/languages/map'
import { languageFilterSql } from '~~/server/services/languages/selection'
import {
  listResponse,
  resolveListPagination,
  resolveSortSql,
} from '~~/server/utils/listQuery'

const SORTABLE = {
  id: schema.languages.id,
  code: schema.languages.code,
  name: schema.languages.name,
  isActive: schema.languages.isActive,
  isDefault: schema.languages.isDefault,
  createdAt: schema.languages.createdAt,
  updatedAt: schema.languages.updatedAt,
} as const

/**
 * Paginated languages list for dashboard.
 */
export async function listLanguages(
  input: ResourceListQuery = {},
): Promise<ResourceListResponse<LanguageListItem>> {
  const pagination = resolveListPagination(input)
  const where = languageFilterSql(input.filters)
  const orderBy = resolveSortSql(SORTABLE, input.sort, {
    id: 'id',
    desc: false,
  })

  const [[totalRow], items] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.languages)
      .where(where),
    db
      .select()
      .from(schema.languages)
      .where(where)
      .orderBy(orderBy)
      .limit(pagination.limit)
      .offset(pagination.offset),
  ])

  return listResponse(
    items.map(mapLanguage),
    totalRow?.total ?? 0,
    pagination,
  )
}
