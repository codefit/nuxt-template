import type {
  BulkAction,
  BulkPayload,
  BulkResult,
  TableFilters,
  TableSelection,
} from '#shared/types/ui/data-table'

export interface TableActionRun<T = unknown> {
  action: BulkAction
  count: number
  selection: TableSelection
  filters?: TableFilters
  rows?: T[]
  /** Defaults to `action.result`. Pass `false` for single-row flows. */
  showResult?: boolean
  clearSelection?: () => void
}

export type RowActionOverrides = Partial<
  Pick<
    BulkAction,
    'confirmTitle' | 'confirmDescription' | 'confirmLabel' | 'cancelLabel' | 'confirmColor'
  >
>

type BulkRunner<T> = (
  payload: BulkPayload<T>,
) => Promise<BulkResult | void | false>

/**
 * Shared confirm → bulk POST → toast / result standard for toolbar bulk and row actions.
 *
 * Pass `getRunBulk` as a getter so callers can wire the runner after an `await`
 * without calling Nuxt composables outside setup.
 */
export function useTableAction<T>(
  getRunBulk?: () => BulkRunner<T> | undefined,
) {
  const confirm = useConfirmDialog()
  const showResult = useResultDialog()
  const toast = useToast()
  const pending = ref(false)

  function toastDone(action: BulkAction, count: number) {
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

  async function run(options: TableActionRun<T>): Promise<boolean> {
    if (pending.value) {
      return false
    }

    const { action, count, selection } = options
    const filters = options.filters ?? {}
    const rows = options.rows ?? []

    if (action.confirm) {
      const ok = await confirm({
        title: action.confirmTitle ?? action.label,
        description:
          action.confirmDescription?.replace('{count}', String(count))
          ?? `Opravdu provést „${action.label}“ pro ${count} položek?`,
        confirmLabel: action.confirmLabel ?? action.label,
        cancelLabel: action.cancelLabel ?? 'Zrušit',
        confirmColor: action.confirmColor ?? 'error',
      })

      if (!ok) {
        return false
      }
    }

    pending.value = true

    const loading = toast.add({
      title: `Provádím „${action.label}“…`,
      description: `${count} položek · ${selection.mode}`,
      color: 'neutral',
      icon: 'i-lucide-loader-circle',
      duration: 0,
    })

    let result: BulkResult | void | false
    const runner = getRunBulk?.()

    try {
      result = runner
        ? await runner({
            action,
            selection: {
              mode: selection.mode,
              ids: [...selection.ids],
            },
            count,
            filters: { ...filters },
            rows,
          })
        : undefined
    }
    catch (error) {
      toast.remove(loading.id)
      toast.add({
        title: `Operace „${action.label}“ selhala`,
        description: error instanceof Error ? error.message : 'Neočekávaná chyba.',
        color: 'error',
        icon: 'i-lucide-circle-x',
      })
      pending.value = false
      return false
    }

    toast.remove(loading.id)

    if (result === false) {
      toast.add({
        title: `Operace „${action.label}“ selhala`,
        description: `Nepodařilo se dokončit akci pro ${count} položek.`,
        color: 'error',
        icon: 'i-lucide-circle-x',
      })
      pending.value = false
      return false
    }

    toastDone(action, count)

    const withResult = options.showResult ?? Boolean(action.result)

    if (withResult && result) {
      await showResult(result)
    }

    options.clearSelection?.()
    pending.value = false
    return true
  }

  /** Single-row action via `POST /bulk` with `selection.mode = include`. */
  async function runRow(
    action: BulkAction,
    id: string | number,
    overrides?: RowActionOverrides,
  ): Promise<boolean> {
    return run({
      action: {
        ...action,
        ...overrides,
        result: false,
      },
      count: 1,
      selection: {
        mode: 'include',
        ids: [String(id)],
      },
      showResult: false,
    })
  }

  return {
    pending,
    run,
    runRow,
  }
}
