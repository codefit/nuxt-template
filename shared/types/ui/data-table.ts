/**
 * Shared DataTable contracts (client + server list / bulk).
 *
 * Section order matches list query flow, then selection / bulk / results.
 */

// --- Selection --------------------------------------------------------------

/**
 * How selected rows are represented for bulk APIs.
 *
 * - `include` — only these ids are selected (typical manual checks).
 * - `exclude` — “all matching filters” except these ids (select-all flow).
 *
 * Always send a small id list + current filters; never every matching id.
 */
export type SelectionMode = 'include' | 'exclude'

export interface TableSelection {
  mode: SelectionMode
  /** include: selected ids; exclude: deselected exceptions */
  ids: string[]
}

// --- Filters ----------------------------------------------------------------

export interface TableFilterOption {
  label: string
  value: string
  /** Optional facet count shown next to the option. */
  count?: number
  /** Nested options (grouped checkbox lists). */
  children?: TableFilterOption[]
}

/** Inclusive date range (`YYYY-MM-DD`), used by `date-range` filters. */
export interface TableDateRange {
  from?: string
  to?: string
}

/**
 * Declared on the page/model — DataTable filter popover (not free-text search).
 *
 * - `select` — predefined values / statuses
 *   - single: dropdown (`USelect`) with empty “unset” option
 *   - `multiple` / nested `children`: checkbox list
 * - `boolean` — yes/no toggle
 * - `date` — single day
 * - `date-range` — from / to
 *
 * Free-text lookup across columns belongs in `TableSearchConfig`, not here.
 */
export interface TableFilter {
  key: string
  type: 'select' | 'boolean' | 'date' | 'date-range'
  icon?: string
  label: string
  options?: TableFilterOption[]
  multiple?: boolean
  trueValue?: string | boolean
  /** Empty option label for single select (default: i18n `table.filterUnset`). */
  placeholder?: string
}

export type TableFilterValue =
  | string
  | string[]
  | boolean
  | TableDateRange
  | undefined

export type TableFilters = Record<string, TableFilterValue>

// --- Search / sort / pagination ---------------------------------------------

/** Single global search across configured columns. */
export interface TableSearchConfig {
  columns: string[]
  queryKey?: string
  placeholder?: string
}

export interface TableSort {
  id: string
  desc: boolean
}

export interface TablePagination {
  pageIndex: number
  pageSize: number
}

// --- Bulk -------------------------------------------------------------------

/** Toast tone after a bulk action finishes. */
export type BulkToast = 'success' | 'error' | 'warning' | 'info'

export interface BulkAction {
  label: string
  value: string
  icon?: string
  toast?: BulkToast
  result?: boolean
  confirm?: boolean
  cancelLabel?: string
  confirmLabel?: string
  confirmTitle?: string
  confirmColor?:
    | 'error'
    | 'primary'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'info'
    | 'secondary'
  confirmDescription?: string
}

/**
 * Client payload for bulk UI + `$fetch` to `POST /api/{model}/bulk`.
 * Prefer `selection` + `filters` on the wire; `rows` is optional local context.
 */
export interface BulkPayload<T = unknown> {
  count: number
  rows: T[]
  action: BulkAction
  filters: TableFilters
  selection: TableSelection
}

// --- Result dialog ----------------------------------------------------------

export interface ResultStat {
  icon?: string
  label: string
  value: string | number
  color?:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'neutral'
    | 'primary'
    | 'secondary'
  description?: string
}

export interface ResultLink {
  href: string
  icon?: string
  label: string
  external?: boolean
}

export interface ResultItem {
  title: string
  badge?: string
  description?: string
}

export interface BulkResult {
  title: string
  items?: ResultItem[]
  links?: ResultLink[]
  stats?: ResultStat[]
  description?: string
}

/** @deprecated Use BulkResult */
export type ActionResult = BulkResult
