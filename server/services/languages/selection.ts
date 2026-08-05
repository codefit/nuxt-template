import { and, count, desc, eq, like, or, type SQL } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Language } from '#shared/types/db'
import type { TableFilters, TableSelection } from '#shared/types/data-table'
import { dateRangeSql, selectionConstraintSql } from '~~/server/utils/filterSql'

function searchSql(value: unknown): SQL | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const pattern = `%${value.trim()}%`

  return or(
    like(schema.languages.code, pattern),
    like(schema.languages.name, pattern),
  )
}

function flagSql(
  column: typeof schema.languages.isActive | typeof schema.languages.isDefault,
  value: unknown,
): SQL | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (value === '1' || value === 1 || value === true || value === 'true') {
    return eq(column, 1)
  }

  if (value === '0' || value === 0 || value === false || value === 'false') {
    return eq(column, 0)
  }

  return undefined
}

export function languageFilterSql(filters: TableFilters = {}): SQL | undefined {
  const parts = [
    searchSql(filters.q),
    dateRangeSql(schema.languages.createdAt, filters.createdAt),
    flagSql(schema.languages.isActive, filters.isActive),
    flagSql(schema.languages.isDefault, filters.isDefault),
  ].filter(Boolean) as SQL[]

  if (!parts.length) {
    return undefined
  }

  return parts.length === 1 ? parts[0] : and(...parts)
}

export function languageSelectionSql(
  selection: TableSelection,
  filters: TableFilters = {},
): SQL | undefined {
  return selectionConstraintSql(
    schema.languages.id,
    selection,
    languageFilterSql(filters),
  )
}

/**
 * Resolve include/exclude selection against filtered languages.
 */
export async function resolveLanguageSelection(
  selection: TableSelection,
  filters: TableFilters = {},
): Promise<{
  matchedTotal: number
  affected: Language[]
}> {
  const filterWhere = languageFilterSql(filters)
  const affectedWhere = languageSelectionSql(selection, filters)

  const [matchedRow, affected] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.languages)
      .where(filterWhere)
      .then(rows => rows[0] ?? { total: 0 }),
    db
      .select()
      .from(schema.languages)
      .where(affectedWhere)
      .orderBy(desc(schema.languages.id)),
  ])

  return {
    matchedTotal: matchedRow.total,
    affected,
  }
}
