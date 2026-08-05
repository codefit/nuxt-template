import {
  and,
  eq,
  gte,
  inArray,
  lte,
  notInArray,
  type SQL,
} from 'drizzle-orm'
import type { TableDateRange, TableSelection } from '#shared/types/data-table'

type RangeColumn = Parameters<typeof gte>[0]
type IdColumn = Parameters<typeof eq>[0]

export function isDateRange(value: unknown): value is TableDateRange {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && ('from' in value || 'to' in value)
  )
}

export function readDateRange(value: unknown): TableDateRange | undefined {
  if (isDateRange(value)) {
    return value
  }

  if (typeof value === 'string' && value.includes('..')) {
    const [from = '', to = ''] = value.split('..')
    const range = {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    }

    return range.from || range.to ? range : undefined
  }

  return undefined
}

/** Build `gte` / `lte` SQL for a `from..to` (or object) date filter. */
export function dateRangeSql(
  column: RangeColumn,
  value: unknown,
): SQL | undefined {
  const range = readDateRange(value)

  if (!range) {
    return undefined
  }

  const parts: SQL[] = []

  if (range.from) {
    parts.push(gte(column, new Date(`${range.from}T00:00:00`)))
  }

  if (range.to) {
    parts.push(lte(column, new Date(`${range.to}T23:59:59.999`)))
  }

  if (!parts.length) {
    return undefined
  }

  return parts.length === 1 ? parts[0] : and(...parts)
}

/**
 * Append include / exclude id constraint to existing filter SQL.
 * Empty include resolves to `id = -1` (no rows).
 */
export function selectionConstraintSql(
  idColumn: IdColumn,
  selection: TableSelection,
  baseWhere?: SQL,
): SQL | undefined {
  const ids = selection.ids
    .map(id => Number(id))
    .filter(id => Number.isFinite(id) && id > 0)

  if (selection.mode === 'include') {
    if (!ids.length) {
      return and(baseWhere, eq(idColumn, -1))
    }

    return and(baseWhere, inArray(idColumn, ids))
  }

  if (!ids.length) {
    return baseWhere
  }

  return and(baseWhere, notInArray(idColumn, ids))
}
