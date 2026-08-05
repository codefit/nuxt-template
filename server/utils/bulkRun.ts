import type {
  BulkResult,
  TableFilters,
  TableSelection,
} from '#shared/types/data-table'
import type { ResourceBulkResponse } from '#shared/types/resource'

interface BulkResolveResult<TRow> {
  matchedTotal: number
  affected: TRow[]
}

interface Options<TRow, TAction extends string> {
  action: TAction
  selection: TableSelection
  filters?: TableFilters
  resolve: (
    selection: TableSelection,
    filters: TableFilters,
  ) => Promise<BulkResolveResult<TRow>>
  /** Optional mutation; skip for read-only actions (e.g. export). */
  mutate?: (action: TAction, affected: TRow[]) => Promise<void>
  buildResult: (
    action: TAction,
    affected: TRow[],
    matchedTotal: number,
  ) => BulkResult
}

/**
 * Shared bulk pipeline: resolve selection → optional mutate → response.
 */
export async function runResourceBulk<TRow, TAction extends string>(
  options: Options<TRow, TAction>,
): Promise<ResourceBulkResponse> {
  const filters = options.filters ?? {}
  const { matchedTotal, affected } = await options.resolve(
    options.selection,
    filters,
  )

  if (options.mutate) {
    await options.mutate(options.action, affected)
  }

  return {
    ok: true,
    action: options.action,
    mode: options.selection.mode,
    affected: affected.length,
    result: options.buildResult(options.action, affected, matchedTotal),
  }
}
