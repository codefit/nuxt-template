import { upperFirst } from 'scule'
import type { Table } from '@tanstack/vue-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { buildActionsColumn, buildSelectColumn } from '~/utils/tableColumns'

interface SelectApi {
  isAllSelected: ComputedRef<boolean>
  isSomeSelected: ComputedRef<boolean>
  isSelected: (id: string) => boolean
  selectAll: (checked: boolean) => void
  selectOne: (id: string, checked: boolean) => void
}

interface Options<T> {
  table: Ref<{ tableApi?: Table<T> } | null>
  columns: MaybeRefOrGetter<TableColumn<T>[]>
  selectable: MaybeRefOrGetter<boolean>
  rowActions?: MaybeRefOrGetter<
    ((row: TableRow<T>) => Array<Record<string, unknown>>) | undefined
  >
  select: SelectApi
}

export function useTableColumns<T>(options: Options<T>) {
  const cols = computed<TableColumn<T>[]>(() => {
    const next: TableColumn<T>[] = []
    const { select } = options

    if (toValue(options.selectable)) {
      next.push(buildSelectColumn<T>({
        isAllSelected: () => select.isAllSelected.value,
        isSomeSelected: () => select.isSomeSelected.value,
        isSelected: select.isSelected,
        selectAll: select.selectAll,
        selectOne: select.selectOne,
      }))
    }

    next.push(...toValue(options.columns))

    const rowActions = toValue(options.rowActions)

    if (rowActions) {
      next.push(buildActionsColumn(rowActions))
    }

    return next
  })

  const columnItems = computed(() => {
    const api = options.table.value?.tableApi

    if (!api) {
      return []
    }

    return api
      .getAllColumns()
      .filter(column => column.getCanHide())
      .map(column => ({
        label: upperFirst(column.id),
        type: 'checkbox' as const,
        checked: column.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          api.getColumn(column.id)?.toggleVisibility(!!checked)
        },
        onSelect(e: Event) {
          e.preventDefault()
        },
      }))
  })

  return {
    cols,
    columnItems,
  }
}
