import { and, count, desc, isNull, like, or, type SQL } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Author } from '#shared/types/db'
import type { TableFilters, TableSelection } from '#shared/types/ui/data-table'
import { dateRangeSql, selectionConstraintSql } from '~~/server/utils/filterSql'

function searchSql(value: unknown): SQL | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const pattern = `%${value.trim()}%`

  return or(
    like(schema.authors.name, pattern),
    like(schema.authors.email, pattern),
    like(schema.authors.phone, pattern),
  )
}

export function authorFilterSql(filters: TableFilters = {}): SQL | undefined {
  const parts = [
    isNull(schema.authors.deletedAt),
    searchSql(filters.q),
    dateRangeSql(schema.authors.createdAt, filters.createdAt),
  ].filter(Boolean) as SQL[]

  return parts.length === 1 ? parts[0] : and(...parts)
}

export function authorSelectionSql(
  selection: TableSelection,
  filters: TableFilters = {},
): SQL | undefined {
  return selectionConstraintSql(
    schema.authors.id,
    selection,
    authorFilterSql(filters),
  )
}

/**
 * Resolve include/exclude selection against filtered authors.
 */
export async function resolveAuthorSelection(
  selection: TableSelection,
  filters: TableFilters = {},
): Promise<{
  matchedTotal: number
  affected: Author[]
}> {
  const filterWhere = authorFilterSql(filters)
  const affectedWhere = authorSelectionSql(selection, filters)

  const [matchedRow, affected] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.authors)
      .where(filterWhere)
      .then(rows => rows[0] ?? { total: 0 }),
    db
      .select()
      .from(schema.authors)
      .where(affectedWhere)
      .orderBy(desc(schema.authors.id)),
  ])

  return {
    matchedTotal: matchedRow.total,
    affected,
  }
}
