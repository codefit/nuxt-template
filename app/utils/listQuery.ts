import type {
  TableFilters,
  TablePagination,
  TableSort,
} from '#shared/types/ui/data-table'
import { serializeFilterValue } from '~/utils/tableQuery'

/** Client mirror of `ResourceListQuery` (table state → GET params). */
interface ListQueryState {
  /** Related data to request, e.g. `['author']` → `?with=author`. */
  with?: string[]
  search?: string
  sorting?: TableSort[]
  filters?: TableFilters
  pagination: TablePagination
}

/**
 * Build GET query for any resource list (`/api/{model}`).
 * Same shape as `ResourceListQuery` / `readListQuery` on the server.
 */
export function toListQuery(state: ListQueryState): Record<string, string> {
  const query: Record<string, string> = {
    page: String(state.pagination.pageIndex + 1),
    limit: String(state.pagination.pageSize),
  }

  if (state.sorting?.length) {
    query.sort = state.sorting
      .map(entry => (entry.desc ? `-${entry.id}` : entry.id))
      .join(',')
  }

  if (state.with?.length) {
    query.with = state.with.join(',')
  }

  const q = state.search?.trim()

  if (q) {
    query.q = q
  }

  for (const [key, value] of Object.entries(state.filters ?? {})) {
    const serialized = serializeFilterValue(value)

    if (serialized) {
      query[key] = serialized
    }
  }

  return query
}
