import { and, count, desc, like, or, type SQL } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Message } from '#shared/types/db'
import type { TableFilters, TableSelection } from '#shared/types/data-table'
import { dateRangeSql, selectionConstraintSql } from '~~/server/utils/filterSql'

// --- Search / filter SQL ----------------------------------------------------

function searchSql(value: unknown): SQL | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const pattern = `%${value.trim()}%`

  return or(
    like(schema.messages.name, pattern),
    like(schema.messages.email, pattern),
    like(schema.messages.message, pattern),
  )
}

export function messageFilterSql(filters: TableFilters = {}): SQL | undefined {
  const parts = [
    searchSql(filters.q),
    dateRangeSql(schema.messages.createdAt, filters.createdAt),
  ].filter(Boolean) as SQL[]

  if (!parts.length) {
    return undefined
  }

  return parts.length === 1 ? parts[0] : and(...parts)
}

/** Append include / exclude id constraint to existing filter SQL. */
export function messageSelectionSql(
  selection: TableSelection,
  filters: TableFilters = {},
): SQL | undefined {
  return selectionConstraintSql(
    schema.messages.id,
    selection,
    messageFilterSql(filters),
  )
}

// --- Selection --------------------------------------------------------------

/**
 * Resolve include/exclude selection against filtered messages.
 * Uses SQL id constraints — does not hydrate the full filtered table for include.
 */
export async function resolveMessageSelection(
  selection: TableSelection,
  filters: TableFilters = {},
): Promise<{
  matchedTotal: number
  affected: Message[]
}> {
  const filterWhere = messageFilterSql(filters)
  const affectedWhere = messageSelectionSql(selection, filters)

  const [matchedRow, affected] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.messages)
      .where(filterWhere)
      .then(rows => rows[0] ?? { total: 0 }),
    db
      .select()
      .from(schema.messages)
      .where(affectedWhere)
      .orderBy(desc(schema.messages.createdAt)),
  ])

  return {
    matchedTotal: matchedRow.total,
    affected,
  }
}
