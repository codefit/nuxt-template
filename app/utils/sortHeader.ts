import { h } from 'vue'
import { UButton } from '#components'
import type { HeaderContext } from '@tanstack/vue-table'

/**
 * Sortable column header button for Nuxt UI / TanStack Table.
 */
export function createSortHeader<T>(label: string) {
  return ({ column }: HeaderContext<T, unknown>) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label,
      icon: isSorted
        ? isSorted === 'asc'
          ? 'i-lucide-arrow-up-narrow-wide'
          : 'i-lucide-arrow-down-wide-narrow'
        : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  }
}

/** @deprecated Use createSortHeader */
export const sortHeader = createSortHeader
