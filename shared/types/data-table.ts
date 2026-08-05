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
  label: string
  type: 'select' | 'boolean' | 'date' | 'date-range'
  icon?: string
  /** Empty option label for single select (default: i18n `table.filterUnset`). */
  placeholder?: string
  options?: TableFilterOption[]
  /** Allow multiple values (select). Stored as string[] / comma-separated in URL. */
  multiple?: boolean
  /** For boolean filters: value written when checked (default `true`). */
  trueValue?: string | boolean
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
  /** Row keys / column ids to match against. */
  columns: string[]
  placeholder?: string
  /** URL query key (default `q`). */
  queryKey?: string
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
  confirm?: boolean
  confirmTitle?: string
  confirmDescription?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?:
    | 'error'
    | 'primary'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'info'
    | 'secondary'
  toast?: BulkToast
  /** After success, open a follow-up result modal (stats / links / items). */
  result?: boolean
}

/**
 * Client payload for bulk UI + `$fetch` to `POST /api/{model}/bulk`.
 * Prefer `selection` + `filters` on the wire; `rows` is optional local context.
 */
export interface BulkPayload<T = unknown> {
  action: BulkAction
  selection: TableSelection
  /** Resolved count (include: ids.length; exclude: matchTotal - ids.length). */
  count: number
  /** Active filters — required for exclude mode on the server. */
  filters: TableFilters
  /**
   * Rows currently loaded that match selection.
   * Useful for client demos / small sets; do not rely on this for large exclude sets.
   */
  rows: T[]
}

// --- Result dialog ----------------------------------------------------------

export interface ResultStat {
  label: string
  value: string | number
  description?: string
  icon?: string
  color?:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'neutral'
    | 'primary'
    | 'secondary'
}

export interface ResultLink {
  label: string
  href: string
  icon?: string
  external?: boolean
}

export interface ResultItem {
  title: string
  description?: string
  badge?: string
}

export interface BulkResult {
  title: string
  description?: string
  stats?: ResultStat[]
  links?: ResultLink[]
  items?: ResultItem[]
}

/** @deprecated Use BulkResult */
export type ActionResult = BulkResult
