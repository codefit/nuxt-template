import { h, type VNode } from 'vue'
import { UButton, UCheckbox, UDropdownMenu } from '#components'
import type { TableColumn, TableRow } from '@nuxt/ui'

interface SelectHandlers {
  isAllSelected: () => boolean
  isSomeSelected: () => boolean
  isSelected: (id: string) => boolean
  selectAll: (checked: boolean) => void
  selectOne: (id: string, checked: boolean) => void
}

export function buildSelectColumn<T>(handlers: SelectHandlers): TableColumn<T> {
  return {
    id: 'select',
    header: () =>
      h(UCheckbox, {
        'modelValue': handlers.isSomeSelected()
          ? 'indeterminate'
          : handlers.isAllSelected(),
        'onUpdate:modelValue': (value: unknown) =>
          handlers.selectAll(!!value),
        'aria-label': 'Select all matching',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': handlers.isSelected(row.id),
        'onUpdate:modelValue': (value: unknown) =>
          handlers.selectOne(row.id, !!value),
        'aria-label': 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
    size: 48,
  }
}

export function buildActionsColumn<T>(
  rowActions: (row: TableRow<T>) => Array<Record<string, unknown>>,
): TableColumn<T> {
  return {
    id: 'actions',
    enableHiding: false,
    size: 56,
    meta: {
      class: {
        th: 'text-end',
        td: 'text-end',
      },
    },
    cell: ({ row }): VNode => {
      const items = rowActions(row)

      return h(
        UDropdownMenu,
        {
          content: { align: 'end' },
          items,
          'aria-label': 'Actions dropdown',
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            'aria-label': 'Actions dropdown',
          }),
      )
    },
  }
}
