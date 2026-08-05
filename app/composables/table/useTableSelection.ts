import type { TableSelection } from '#shared/types/ui/data-table'

interface Options {
  /** Ids currently loaded / matching filters on the client. */
  matchIds: Ref<string[]>
  /** Total matching rows from API `meta.total` (select-all / pager). */
  matchTotal: MaybeRefOrGetter<number>
}

/**
 * Include / exclude selection for DataTable bulk ops.
 * Select-all → exclude mode with empty exceptions; manual picks → include.
 */
export function useTableSelection(options: Options) {
  const selection = ref<TableSelection>({
    mode: 'include',
    ids: [],
  })

  // --- Derived --------------------------------------------------------------

  const matchTotal = computed(() => toValue(options.matchTotal))

  const selectedCount = computed(() => {
    const total = matchTotal.value

    if (selection.value.mode === 'exclude') {
      return Math.max(0, total - selection.value.ids.length)
    }

    return selection.value.ids.length
  })

  const isAllSelected = computed(() => {
    const total = matchTotal.value

    return total > 0 && selectedCount.value === total
  })

  const isSomeSelected = computed(() => {
    const count = selectedCount.value

    return count > 0 && count < matchTotal.value
  })

  const selectionHint = computed(() => {
    const { mode, ids } = selection.value

    if (mode === 'exclude') {
      return ids.length
        ? `Všechny filtrované kromě ${ids.length}`
        : 'Všechny filtrované'
    }

    return null
  })

  // --- Mutators -------------------------------------------------------------

  function isSelected(id: string) {
    if (selection.value.mode === 'exclude') {
      return !selection.value.ids.includes(id)
    }

    return selection.value.ids.includes(id)
  }

  function selectOne(id: string, checked: boolean) {
    if (selection.value.mode === 'exclude') {
      const excluded = new Set(selection.value.ids)

      if (checked) {
        excluded.delete(id)
      }
      else {
        excluded.add(id)
      }

      const next = [...excluded]

      if (next.length >= matchTotal.value) {
        selection.value = { mode: 'include', ids: [] }
        return
      }

      selection.value = { mode: 'exclude', ids: next }
      return
    }

    const included = new Set(selection.value.ids)

    if (checked) {
      included.add(id)
    }
    else {
      included.delete(id)
    }

    const next = [...included]

    if (matchTotal.value > 0 && next.length === matchTotal.value) {
      selection.value = { mode: 'exclude', ids: [] }
      return
    }

    selection.value = { mode: 'include', ids: next }
  }

  function selectAll(checked: boolean) {
    if (checked) {
      selection.value = { mode: 'exclude', ids: [] }
      return
    }

    selection.value = { mode: 'include', ids: [] }
  }

  function clear() {
    selection.value = { mode: 'include', ids: [] }
  }

  // --- Bridges --------------------------------------------------------------

  /** TanStack-compatible map for UTable v-model:row-selection. */
  const rowSelection = computed<Record<string, boolean>>({
    get() {
      const map: Record<string, boolean> = {}

      for (const id of options.matchIds.value) {
        if (isSelected(id)) {
          map[id] = true
        }
      }

      return map
    },
    set(value) {
      const checked = Object.entries(value)
        .filter(([, on]) => on)
        .map(([id]) => id)

      const match = options.matchIds.value
      const total = matchTotal.value

      if (checked.length === 0) {
        selection.value = { mode: 'include', ids: [] }
        return
      }

      if (total > 0 && checked.length === total) {
        selection.value = { mode: 'exclude', ids: [] }
        return
      }

      if (selection.value.mode === 'exclude') {
        const excluded = match.filter(id => !checked.includes(id))
        selection.value = { mode: 'exclude', ids: excluded }
        return
      }

      selection.value = { mode: 'include', ids: checked }
    },
  })

  function resolveRows<T>(rows: T[], getRowId: (row: T) => string): T[] {
    return rows.filter(row => isSelected(getRowId(row)))
  }

  return {
    selection,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    selectionHint,
    isSelected,
    selectOne,
    selectAll,
    clear,
    rowSelection,
    resolveRows,
  }
}
