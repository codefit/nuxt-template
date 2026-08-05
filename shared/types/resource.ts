import type {
  BulkAction,
  BulkResult,
  SelectionMode,
  TableFilter,
  TableFilters,
  TableSelection,
  TableSort,
} from './data-table'

/**
 * Standard resource API surface (Nitro file routes).
 *
 * ```
 * GET    /api/{model}          list
 * POST   /api/{model}          create
 * GET    /api/{model}/:id      detail
 * PATCH  /api/{model}/:id      update
 * DELETE /api/{model}/:id      delete
 * POST   /api/{model}/bulk     bulk (action + selection + filters)
 * ```
 *
 * Models may omit capabilities they do not support; UI reads `capabilities`.
 */

// --- Actions & capabilities -------------------------------------------------

export type ResourceAction =
  | 'list'
  | 'create'
  | 'detail'
  | 'update'
  | 'delete'
  | 'bulk'

export interface ResourceCapabilities {
  list?: boolean
  create?: boolean
  detail?: boolean
  update?: boolean
  delete?: boolean
  /** Bulk action values this model accepts (subset of page BulkAction[].value). */
  bulk?: string[]
  filters?: TableFilter[]
  sortable?: string[]
}

/** Page-level wiring: what this model can do in the DataTable shell. */
export interface ResourceTableConfig {
  model: string
  capabilities: ResourceCapabilities
  bulkActions?: BulkAction[]
}

// --- List pagination --------------------------------------------------------

/** Allowed `limit` values for every resource DataTable list. */
export const RESOURCE_PAGE_SIZES = [10, 20, 50, 100] as const
export const RESOURCE_DEFAULT_LIMIT = RESOURCE_PAGE_SIZES[0]
/** Hard cap for any list `?limit=` (public + dashboard). */
export const RESOURCE_MAX_LIMIT = 100
/** Public articles grid: 2×4. */
export const PUBLIC_ARTICLE_LIMIT = 8

export type ResourcePageSize = (typeof RESOURCE_PAGE_SIZES)[number]

/**
 * Shared list input for every DataTable-backed model.
 * Maps 1:1 to URL/query: `?page=&limit=&q=&sort=&…filters`.
 * Optional relations: `?with=author` (comma-separated).
 */
export interface ResourceListQuery {
  page?: number
  limit?: number
  sort?: TableSort[]
  /** Includes global search as `q` when present. */
  filters?: TableFilters
  /** Related data to include, e.g. `['author']`. */
  with?: string[]
}

/** Resolved page window (offset = (page - 1) * limit). */
export interface ResourceListPagination {
  page: number
  limit: number
  offset: number
}

export interface ResourceListMeta {
  page: number
  limit: number
  total: number
}

export interface ResourceListResponse<T> {
  items: T[]
  meta: ResourceListMeta
}

// --- Bulk -------------------------------------------------------------------

/** Body for `POST /api/{model}/bulk`. */
export interface ResourceBulkBody {
  action: string
  selection: TableSelection
  /** Prefer `filters.q` or top-level search — both are accepted. */
  search?: string
  filters?: TableFilters
}

export interface ResourceBulkResponse {
  ok: true
  action: string
  mode: SelectionMode
  /** Rows actually processed. */
  affected: number
  /** Optional follow-up for ResultDialog. */
  result?: BulkResult
}
