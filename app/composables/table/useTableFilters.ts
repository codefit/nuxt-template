import type {
  TableFilter,
  TableFilterValue,
  TableFilters,
} from '#shared/types/data-table'
import {
  activeFilterCount,
  filterLabel,
  isFilterActive,
} from '~/utils/tableQuery'

export interface FilterChip {
  key: string
  label: string
}

interface Options {
  filters: MaybeRefOrGetter<TableFilter[]>
  filterValues: Ref<TableFilters>
  onChange?: () => void
}

/**
 * Modal / popover filter state helpers (active count, chips, setters).
 */
export function useTableFilters(options: Options) {
  const fields = computed(() => toValue(options.filters))

  const activeCount = computed(() =>
    activeFilterCount(options.filterValues.value),
  )

  const chips = computed<FilterChip[]>(() =>
    fields.value.flatMap((field) => {
      const label = filterLabel(field, options.filterValues.value[field.key])

      if (!label) {
        return []
      }

      return [{ key: field.key, label }]
    }),
  )

  function isActive(key: string) {
    return isFilterActive(options.filterValues.value[key])
  }

  function setValue(key: string, value: TableFilterValue) {
    const next = { ...options.filterValues.value }

    if (!isFilterActive(value)) {
      delete next[key]
    }
    else {
      next[key] = value
    }

    options.filterValues.value = next
    options.onChange?.()
  }

  function clearKey(key: string) {
    setValue(key, undefined)
  }

  function clearAll() {
    options.filterValues.value = {}
    options.onChange?.()
  }

  watch(
    options.filterValues,
    () => {
      options.onChange?.()
    },
    { deep: true },
  )

  return {
    fields,
    activeCount,
    chips,
    isActive,
    setValue,
    clearKey,
    clearAll,
  }
}
