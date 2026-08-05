import type {
  TableFilters,
  TablePagination,
  TableSort,
} from '#shared/types/ui/data-table'
import {
  RESOURCE_DEFAULT_LIMIT,
  RESOURCE_PAGE_SIZES,
} from '#shared/types/ui/resource'
import type { LocationQuery, LocationQueryValue } from 'vue-router'
import { parseFilterValue, serializeFilterValue } from '~/utils/tableQuery'

interface Options {
  pageSize?: number
  pageSizes?: number[]
  /** URL query key for global search (default `q`). */
  searchKey?: string
  /** Query keys for modal filters. */
  filterKeys?: string[]
  /** Filter keys stored as `from..to` date ranges. */
  dateRangeKeys?: string[]
  /** Filter keys stored as comma-separated lists. */
  multiFilterKeys?: string[]
}

// --- Query helpers ----------------------------------------------------------

function firstQuery(value: LocationQueryValue | LocationQueryValue[]): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  return raw == null || raw === '' ? undefined : String(raw)
}

function parseSort(raw: string | undefined): TableSort[] {
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

function formatSort(sorting: TableSort[]): string | undefined {
  if (!sorting.length) {
    return undefined
  }

  return sorting
    .map(entry => (entry.desc ? `-${entry.id}` : entry.id))
    .join(',')
}

function sameQuery(a: LocationQuery, b: LocationQuery): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])

  for (const key of keys) {
    if (firstQuery(a[key] ?? null) !== firstQuery(b[key] ?? null)) {
      return false
    }
  }

  return true
}

/**
 * Sync DataTable pagination / sort / search / filters with URL query.
 *
 * `?page=2&limit=20&sort=-createdAt&q=jan&createdAt=2024-01-01..2024-01-31`
 */
export function useTableState(options: Options = {}) {
  const route = useRoute()
  const router = useRouter()

  const pageSizes = options.pageSizes ?? [...RESOURCE_PAGE_SIZES]
  const defaultSize = options.pageSize ?? RESOURCE_DEFAULT_LIMIT
  const searchKey = options.searchKey ?? 'q'
  const filterKeys = options.filterKeys ?? []
  const multiKeys = new Set(options.multiFilterKeys ?? [])
  const rangeKeys = new Set(options.dateRangeKeys ?? [])

  function resolveSize(raw: unknown): number {
    const size = Number(raw)
    return pageSizes.includes(size) ? size : defaultSize
  }

  function parseKind(key: string) {
    if (rangeKeys.has(key)) {
      return 'range' as const
    }

    if (multiKeys.has(key)) {
      return 'multi' as const
    }

    return undefined
  }

  // --- Read / write query (pagination → sort → search → filters) ------------

  function readQuery(query: LocationQuery) {
    const page = Math.max(1, Number(firstQuery(query.page ?? null)) || 1)
    const filters: TableFilters = {}

    for (const key of filterKeys) {
      const value = firstQuery(query[key] ?? null)

      if (value === undefined) {
        continue
      }

      filters[key] = parseFilterValue(value, parseKind(key))
    }

    return {
      pagination: {
        pageIndex: page - 1,
        pageSize: resolveSize(firstQuery(query.limit ?? null)),
      } satisfies TablePagination,
      sorting: parseSort(firstQuery(query.sort ?? null)),
      search: firstQuery(query[searchKey] ?? null) ?? '',
      filters,
    }
  }

  function buildQuery(): LocationQuery {
    const next: LocationQuery = { ...route.query }
    const page = pagination.value.pageIndex + 1
    const limit = resolveSize(pagination.value.pageSize)
    const sort = formatSort(sorting.value)
    const q = search.value.trim()

    if (page > 1) {
      next.page = String(page)
    }
    else {
      delete next.page
    }

    if (limit !== defaultSize) {
      next.limit = String(limit)
    }
    else {
      delete next.limit
    }

    if (sort) {
      next.sort = sort
    }
    else {
      delete next.sort
    }

    if (q) {
      next[searchKey] = q
    }
    else {
      delete next[searchKey]
    }

    for (const key of filterKeys) {
      const serialized = serializeFilterValue(filters.value[key])

      if (!serialized) {
        delete next[key]
        continue
      }

      next[key] = serialized
    }

    return next
  }

  // --- State ----------------------------------------------------------------

  const initial = readQuery(route.query)

  const pagination = ref<TablePagination>({ ...initial.pagination })
  const sorting = ref<TableSort[]>([...initial.sorting])
  const search = ref(initial.search)
  const filters = ref<TableFilters>({ ...initial.filters })

  let syncing = false

  function applyQuery(query: LocationQuery) {
    const next = readQuery(query)

    pagination.value = { ...next.pagination }
    sorting.value = [...next.sorting]
    search.value = next.search
    filters.value = { ...next.filters }
  }

  function resetPage() {
    if (pagination.value.pageIndex === 0) {
      return
    }

    pagination.value = {
      ...pagination.value,
      pageIndex: 0,
    }
  }

  // --- Sync watches ---------------------------------------------------------

  // flush: 'sync' so page resets before listQuery / URL watch see the change
  // (avoids double-fetch: old page + new filters, then page 0).
  watch(search, resetPage, { flush: 'sync' })

  watch(
    filters,
    resetPage,
    { deep: true, flush: 'sync' },
  )

  watch(
    sorting,
    resetPage,
    { deep: true, flush: 'sync' },
  )

  watch(
    [pagination, sorting, search, filters],
    async () => {
      if (syncing) {
        return
      }

      const next = buildQuery()

      if (sameQuery(route.query, next)) {
        return
      }

      syncing = true
      await router.replace({ query: next })
      syncing = false
    },
    { deep: true },
  )

  watch(
    () => route.query,
    (query) => {
      if (syncing) {
        return
      }

      const next = buildQuery()

      if (sameQuery(query, next)) {
        return
      }

      syncing = true
      applyQuery(query)
      syncing = false
    },
  )

  // --- Public API -----------------------------------------------------------

  function setPageSize(size: number) {
    pagination.value = {
      pageIndex: 0,
      pageSize: resolveSize(size),
    }
  }

  function reset() {
    pagination.value = {
      pageIndex: 0,
      pageSize: defaultSize,
    }
    sorting.value = []
    search.value = ''
    filters.value = {}
  }

  return {
    pagination,
    sorting,
    search,
    filters,
    pageSizes,
    setPageSize,
    reset,
  }
}
