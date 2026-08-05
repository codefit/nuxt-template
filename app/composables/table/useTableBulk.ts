import type {
  BulkAction,
  BulkPayload,
  BulkResult,
  TableFilters,
  TableSelection,
} from '#shared/types/data-table'

interface Options<T> {
  selection: MaybeRefOrGetter<TableSelection>
  selectedCount: MaybeRefOrGetter<number>
  filterValues: MaybeRefOrGetter<TableFilters>
  data: MaybeRefOrGetter<T[]>
  getRowId: (row: T) => string
  resolveRows: (rows: T[], getRowId: (row: T) => string) => T[]
  bulkActions: MaybeRefOrGetter<BulkAction[]>
  clearSelection: () => void
  runBulk?: (payload: BulkPayload<T>) => Promise<BulkResult | void | false>
}

export function useTableBulk<T>(options: Options<T>) {
  const confirm = useConfirmDialog()
  const showResult = useResultDialog()
  const toast = useToast()
  const bulkValue = ref<string | undefined>()
  const bulkPending = ref(false)

  function toastBulk(action: BulkAction, count: number) {
    const color = action.toast ?? 'success'

    toast.add({
      title: `Operace „${action.label}“`,
      description: ({
        success: `Provedla se operace pro ${count} položek.`,
        error: `Operace selhala pro ${count} položek.`,
        warning: `Varování při operaci pro ${count} položek.`,
        info: `Provedla se operace pro ${count} položek.`,
      })[color],
      color,
      icon: ({
        success: 'i-lucide-circle-check',
        error: 'i-lucide-circle-x',
        warning: 'i-lucide-triangle-alert',
        info: 'i-lucide-info',
      })[color],
    })
  }

  async function runBulkAction(value: string | undefined) {
    if (bulkPending.value) {
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

    if (action.confirm) {
      const ok = await confirm({
        title: action.confirmTitle ?? action.label,
        description:
          action.confirmDescription?.replace('{count}', String(selectedCount))
          ?? `Opravdu provést „${action.label}“ pro ${selectedCount} položek?`,
        confirmLabel: action.confirmLabel ?? action.label,
        cancelLabel: action.cancelLabel ?? 'Zrušit',
        confirmColor: action.confirmColor ?? 'error',
      })

      if (!ok) {
        bulkValue.value = undefined
        return
      }
    }

    const selection = toValue(options.selection)
    const filterValues = toValue(options.filterValues)
    const data = toValue(options.data)
    const rows = options.resolveRows(data, options.getRowId)
    const count = selectedCount

    const payload: BulkPayload<T> = {
      action,
      selection: {
        mode: selection.mode,
        ids: [...selection.ids],
      },
      count,
      filters: { ...filterValues },
      rows,
    }

    bulkPending.value = true

    const pending = toast.add({
      title: `Provádím „${action.label}“…`,
      description: `${count} položek · ${payload.selection.mode}`,
      color: 'neutral',
      icon: 'i-lucide-loader-circle',
      duration: 0,
    })

    let result: BulkResult | void | false

    try {
      result = options.runBulk
        ? await options.runBulk(payload)
        : undefined
    }
    catch (error) {
      toast.remove(pending.id)
      toast.add({
        title: `Operace „${action.label}“ selhala`,
        description: error instanceof Error ? error.message : 'Neočekávaná chyba.',
        color: 'error',
        icon: 'i-lucide-circle-x',
      })
      bulkValue.value = undefined
      bulkPending.value = false
      return
    }

    toast.remove(pending.id)

    if (result === false) {
      toast.add({
        title: `Operace „${action.label}“ selhala`,
        description: `Nepodařilo se dokončit akci pro ${count} položek.`,
        color: 'error',
        icon: 'i-lucide-circle-x',
      })
      bulkValue.value = undefined
      bulkPending.value = false
      return
    }

    toastBulk(action, count)

    if (action.result && result) {
      await showResult(result)
    }

    options.clearSelection()
    bulkValue.value = undefined
    bulkPending.value = false
  }

  return {
    bulkValue,
    bulkPending,
    runBulkAction,
  }
}
