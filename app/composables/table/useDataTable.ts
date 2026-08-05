import type { Table } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import type {
  BulkAction,
  BulkPayload,
  BulkResult,
  TableFilter,
  TableFilters,
  TableSearchConfig,
} from '#shared/types/ui/data-table'

interface TableExpose<T> {
  tableApi?: Table<T>
}

interface Options<T> {
  data: MaybeRefOrGetter<T[]>
  total: MaybeRefOrGetter<number>
  search: Ref<string>
  columns: MaybeRefOrGetter<TableColumn<T>[]>
  getRowId: (row: T) => string
  filters: MaybeRefOrGetter<TableFilter[]>
  runBulk?: (
    payload: BulkPayload<T>,
  ) => Promise<BulkResult | void | false>
  selectable: MaybeRefOrGetter<boolean>
  rowActions?: MaybeRefOrGetter<
    ((row: TableRow<T>) => Array<Record<string, unknown>>) | undefined
  >
  bulkActions: MaybeRefOrGetter<BulkAction[]>
  searchConfig: MaybeRefOrGetter<TableSearchConfig | undefined>
  filterValues: Ref<TableFilters>
}

/**
 * Orchestrates server-driven pagination, sort, search, filters, selection and bulk.
 * Rows are always the current API page — never client-filtered.
 */
export function useDataTable<T>(options: Options<T>) {
  const table = useTemplateRef<TableExpose<T>>('table')

  const filtered = computed(() => toValue(options.data))

  const matchIds = computed(() =>
    filtered.value.map(row => options.getRowId(row)),
  )

  const pageTotal = computed(() => toValue(options.total) ?? 0)

  const paginationOptions = computed(() => ({
    manualPagination: true,
  }))

  const sortingOptions = computed(() => ({
    manualSorting: true,
  }))

  const select = useTableSelection({
    matchIds,
    matchTotal: pageTotal,
  })

  const queryFilters = computed<TableFilters>(() => {
    const q = options.search.value.trim()

    return {
      ...options.filterValues.value,
      ...(q ? { q } : {}),
    }
  })

  watch(
    queryFilters,
    () => {
      select.clear()
    },
    { deep: true },
  )

  const filterApi = useTableFilters({
    filters: options.filters,
    filterValues: options.filterValues,
  })

  const { bulkValue, bulkPending, runBulkAction } = useTableBulk<T>({
    selection: select.selection,
    selectedCount: select.selectedCount,
    filterValues: queryFilters,
    data: filtered,
    getRowId: options.getRowId,
    resolveRows: select.resolveRows,
    bulkActions: () => toValue(options.bulkActions),
    clearSelection: select.clear,
    runBulk: options.runBulk,
  })

  const { cols, columnItems } = useTableColumns<T>({
    table,
    columns: options.columns,
    selectable: options.selectable,
    rowActions: options.rowActions,
    select: {
      isAllSelected: select.isAllSelected,
      isSomeSelected: select.isSomeSelected,
      isSelected: select.isSelected,
      selectAll: select.selectAll,
      selectOne: select.selectOne,
    },
  })

  return {
    table,
    filtered,
    matchIds,
    pageTotal,
    paginationOptions,
    sortingOptions,
    selection: select.selection,
    selectedCount: select.selectedCount,
    selectionHint: select.selectionHint,
    rowSelection: select.rowSelection,
    clearSelection: select.clear,
    filterApi,
    bulkValue,
    bulkPending,
    runBulkAction,
    cols,
    columnItems,
  }
}
