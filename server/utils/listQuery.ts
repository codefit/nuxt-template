import { asc, desc, type SQL } from 'drizzle-orm'
import type { H3Event } from 'h3'
import type { TableFilters, TableSort } from '#shared/types/data-table'
import {
  RESOURCE_DEFAULT_LIMIT,
  RESOURCE_MAX_LIMIT,
  type ResourceListMeta,
  type ResourceListPagination,
  type ResourceListQuery,
  type ResourceListResponse,
} from '#shared/types/resource'

type SortColumn = Parameters<typeof desc>[0]

// --- Query parsing ----------------------------------------------------------

function first(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return first(value[0])
  }

  if (value == null || value === '') {
    return undefined
  }

  return String(value)
}

function parseRange(raw: string | undefined) {
  if (!raw || !raw.includes('..')) {
    return undefined
  }

  const [from = '', to = ''] = raw.split('..')
  const range = {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }

  return range.from || range.to ? range : undefined
}

export function parseSortParam(raw: string | undefined): TableSort[] {
  if (!raw) {
    return []
  }

  return raw.split(',').flatMap((part) => {
    const token = part.trim()

    if (!token) {
      return []
    }

    if (token.startsWith('-')) {
      return [{ id: token.slice(1), desc: true }]
    }

    const [id, dir] = token.split(':')

    if (!id) {
      return []
    }

    return [{ id, desc: dir === 'desc' }]
  })
}

export function parseWithParam(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return []
  }

  return [...new Set(
    raw
      .split(',')
      .map(part => part.trim())
      .filter(Boolean),
  )]
}

/**
 * Parse standard DataTable list query for any model.
 *
 * `?page=2&limit=20&q=jan&sort=-createdAt&createdAt=2024-01-01..2024-01-31&with=author`
 */
export function readListQuery(
  event: H3Event,
  filterKeys: string[] = [],
): ResourceListQuery {
  const query = getQuery(event)
  const q = first(query.q)?.trim()
  const filters: TableFilters = {}

  if (q) {
    filters.q = q
  }

  for (const key of filterKeys) {
    const raw = first(query[key])

    if (!raw) {
      continue
    }

    const range = parseRange(raw)

    if (range) {
      filters[key] = range
      continue
    }

    filters[key] = raw
  }

  const withRelations = parseWithParam(first(query.with))

  return {
    page: Number(first(query.page)) || undefined,
    limit: Number(first(query.limit)) || undefined,
    sort: parseSortParam(first(query.sort)),
    filters,
    ...(withRelations.length ? { with: withRelations } : {}),
  }
}

// --- Pagination -------------------------------------------------------------

export function resolveListPage(raw: number | undefined): number {
  const page = Number(raw)

  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

/** Accept any integer 1…RESOURCE_MAX_LIMIT (DataTable UI still offers RESOURCE_PAGE_SIZES). */
export function resolveListLimit(raw: number | undefined): number {
  const limit = Number(raw)

  if (Number.isFinite(limit) && limit >= 1 && limit <= RESOURCE_MAX_LIMIT) {
    return Math.floor(limit)
  }

  return RESOURCE_DEFAULT_LIMIT
}

/** Normalize page/limit → offset for every resource list. */
export function resolveListPagination(
  input: Pick<ResourceListQuery, 'page' | 'limit'> = {},
): ResourceListPagination {
  const page = resolveListPage(input.page)
  const limit = resolveListLimit(input.limit)

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  }
}

// --- Sort -------------------------------------------------------------------

/**
 * Build ORDER BY from shared `sort` + model column map.
 */
export function resolveSortSql<T extends Record<string, SortColumn>>(
  columns: T,
  sorting: TableSort[] | undefined,
  fallback: { id: keyof T & string, desc: boolean },
): SQL {
  const entry = sorting?.[0]
  const key = entry && entry.id in columns
    ? (entry.id as keyof T & string)
    : fallback.id
  const column = columns[key] ?? columns[fallback.id]
  const descending = entry && entry.id in columns
    ? entry.desc
    : fallback.desc

  if (!column) {
    throw createError({
      statusCode: 500,
      message: `Missing sort column: ${String(fallback.id)}`,
    })
  }

  return descending ? desc(column) : asc(column)
}

// --- Response ---------------------------------------------------------------

export function listMeta(
  total: number,
  pagination: ResourceListPagination,
): ResourceListMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
  }
}

export function listResponse<T>(
  items: T[],
  total: number,
  pagination: ResourceListPagination,
): ResourceListResponse<T> {
  return {
    items,
    meta: listMeta(total, pagination),
  }
}
