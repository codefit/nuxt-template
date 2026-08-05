<script setup lang="ts" generic="T">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type {
  BulkAction,
  BulkPayload,
  BulkResult,
  TableFilter,
  TableFilters,
  TablePagination,
  TableSearchConfig,
  TableSort,
} from '#shared/types/ui/data-table'
import { RESOURCE_DEFAULT_LIMIT, RESOURCE_PAGE_SIZES } from '#shared/types/ui/resource'

const props = withDefaults(
  defineProps<{
    data: T[]
    total: number
    sticky?: boolean
    loading?: boolean
    columns: TableColumn<T>[]
    filters?: TableFilter[]
    runBulk?: (
      payload: BulkPayload<T>,
    ) => Promise<BulkResult | void | false>
    getRowId: (row: T) => string
    pageSizes?: number[]
    selectable?: boolean
    tableClass?: string
    rowActions?: (row: TableRow<T>) => Array<Record<string, unknown>>
    bulkActions?: BulkAction[]
    columnToggle?: boolean
    searchConfig?: TableSearchConfig
  }>(),
  {
    loading: false,
    pageSizes: () => [...RESOURCE_PAGE_SIZES],
    filters: () => [],
    selectable: true,
    bulkActions: () => [],
    columnToggle: true,
    sticky: false,
    tableClass: '',
  },
)

const pagination = defineModel<TablePagination>('pagination', {
  default: () => ({ pageIndex: 0, pageSize: RESOURCE_DEFAULT_LIMIT }),
})

const sorting = defineModel<TableSort[]>('sorting', {
  default: () => [],
})

const search = defineModel<string>('search', { default: '' })

const filterValues = defineModel<TableFilters>('filterValues', {
  default: () => ({}),
})

const {
  table,
  filtered,
  matchIds,
  pageTotal,
  paginationOptions,
  sortingOptions,
  selection,
  selectedCount,
  selectionHint,
  rowSelection,
  clearSelection,
  bulkValue,
  bulkPending,
  runBulkAction,
  cols,
  columnItems,
} = useDataTable<T>({
  data: () => props.data,
  columns: () => props.columns,
  getRowId: props.getRowId,
  total: () => props.total,
  search,
  searchConfig: () => props.searchConfig,
  filters: () => props.filters,
  filterValues,
  selectable: () => props.selectable,
  bulkActions: () => props.bulkActions,
  rowActions: () => props.rowActions,
  runBulk: props.runBulk,
})

/** Keep select + actions visible while scrolling horizontally (Nuxt UI column pinning). */
const columnPinning = ref<{ left: string[], right: string[] }>({
  left: props.selectable ? ['select'] : [],
  right: props.rowActions ? ['actions'] : [],
})

watch(
  () => [props.selectable, Boolean(props.rowActions)] as const,
  ([selectable, hasActions]) => {
    columnPinning.value = {
      left: selectable ? ['select'] : [],
      right: hasActions ? ['actions'] : [],
    }
  },
)
</script>

<template>
  <div class="w-full divide-y divide-accented overflow-hidden rounded-lg border border-default">
    <DataTableToolbar
      v-model:search="search"
      v-model:filter-values="filterValues"
      :search-config="searchConfig"
      :filters="filters"
      :column-toggle="columnToggle"
      :column-items="columnItems"
    >
      <slot name="toolbar" />
    </DataTableToolbar>

    <DataTableBulkBar
      v-if="selectable"
      :selected-count="selectedCount"
      :selection-hint="selectionHint"
      :bulk-actions="bulkActions"
      :bulk-value="bulkValue"
      :bulk-pending="bulkPending"
      @update:bulk-value="runBulkAction"
      @clear="clearSelection"
    />

    <UTable
      ref="table"
      v-model:row-selection="rowSelection"
      v-model:sorting="sorting"
      v-model:pagination="pagination"
      v-model:column-pinning="columnPinning"
      :data="filtered"
      :columns="cols"
      :loading="loading"
      :get-row-id="getRowId"
      :sticky="sticky"
      :class="tableClass"
      :pagination-options="paginationOptions"
      :sorting-options="sortingOptions"
    >
      <template
        v-for="(_, name) in $slots"
        :key="name"
        #[name]="slotProps"
      >
        <slot
          v-if="name !== 'toolbar'"
          :name="name"
          v-bind="slotProps ?? {}"
        />
      </template>
    </UTable>

    <DataTableFooter
      v-model:pagination="pagination"
      :page-total="pageTotal"
      :page-sizes="pageSizes"
      :selectable="selectable"
      :selected-count="selectedCount"
      :match-count="matchIds.length"
      :selection-mode="selection.mode"
      :selection-ids="selection.ids.length"
    />
  </div>
</template>
