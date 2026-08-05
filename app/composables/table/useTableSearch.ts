import type { TableSearchConfig } from '#shared/types/ui/data-table'

interface Options {
  config: MaybeRefOrGetter<TableSearchConfig | undefined>
  search: Ref<string>
  onChange?: () => void
}

/**
 * Single global search across configured columns.
 */
export function useTableSearch(options: Options) {
  const enabled = computed(() => {
    const config = toValue(options.config)
    return Boolean(config?.columns?.length)
  })

  const placeholder = computed(
    () => toValue(options.config)?.placeholder ?? 'Hledat…',
  )

  const columns = computed(() => toValue(options.config)?.columns ?? [])

  watch(
    options.search,
    () => {
      options.onChange?.()
    },
  )

  function clear() {
    options.search.value = ''
  }

  return {
    enabled,
    placeholder,
    columns,
    clear,
  }
}
