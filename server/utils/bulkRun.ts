import type {
  BulkResult,
  TableFilters,
  TableSelection,
} from '#shared/types/ui/data-table'
import type { ResourceBulkResponse } from '#shared/types/ui/resource'

interface BulkResolveResult<TRow> {
  affected: TRow[]
  matchedTotal: number
}

interface Options<TRow, TAction extends string> {
  action: TAction
  mutate?: (action: TAction, affected: TRow[]) => Promise<void>
  resolve: (
    selection: TableSelection,
    filters: TableFilters,
  ) => Promise<BulkResolveResult<TRow>>
  filters?: TableFilters
  selection: TableSelection
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
