import type {
  BulkAction,
  BulkPayload,
  BulkResult,
  TableFilters,
  TableSelection,
} from '#shared/types/ui/data-table'

interface Options<T> {
  data: MaybeRefOrGetter<T[]>
  getRowId: (row: T) => string
  runBulk?: (payload: BulkPayload<T>) => Promise<BulkResult | void | false>
  selection: MaybeRefOrGetter<TableSelection>
  resolveRows: (rows: T[], getRowId: (row: T) => string) => T[]
  bulkActions: MaybeRefOrGetter<BulkAction[]>
  filterValues: MaybeRefOrGetter<TableFilters>
  selectedCount: MaybeRefOrGetter<number>
  clearSelection: () => void
}

export function useTableBulk<T>(options: Options<T>) {
  const { pending, run } = useTableAction<T>(() => options.runBulk)
  const bulkValue = ref<string | undefined>()

  async function runBulkAction(value: string | undefined) {
    if (pending.value) {
      return
    }

    bulkValue.value = value

    const selectedCount = toValue(options.selectedCount)
    const bulkActions = toValue(options.bulkActions)

    if (!value || selectedCount === 0) {
      bulkValue.value = undefined
      return
    }

    const action = bulkActions.find(entry => entry.value === value)

    if (!action) {
      bulkValue.value = undefined
      return
    }

    const selection = toValue(options.selection)
    const filterValues = toValue(options.filterValues)
    const data = toValue(options.data)
    const rows = options.resolveRows(data, options.getRowId)

    await run({
      action,
      count: selectedCount,
      selection: {
        mode: selection.mode,
        ids: [...selection.ids],
      },
      filters: { ...filterValues },
      rows,
      clearSelection: options.clearSelection,
    })

    bulkValue.value = undefined
  }

  return {
    bulkValue,
    bulkPending: pending,
    runBulkAction,
  }
}
