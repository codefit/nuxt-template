<script setup lang="ts">
import type {
  TableFilter,
  TableFilters,
  TableSearchConfig,
} from '#shared/types/data-table'
import { filterLabel, isFilterActive } from '~/utils/tableQuery'

const props = defineProps<{
  searchConfig?: TableSearchConfig
  filters: TableFilter[]
  columnToggle?: boolean
  columnItems: Array<Record<string, unknown>>
}>()

const search = defineModel<string>('search', { default: '' })

const filterValues = defineModel<TableFilters>('filterValues', {
  default: () => ({}),
})

const chips = computed(() =>
  props.filters.flatMap((field) => {
    const label = filterLabel(field, filterValues.value[field.key])

    if (!label || !isFilterActive(filterValues.value[field.key])) {
      return []
    }

    return [{ key: field.key, label }]
  }),
)

function clearKey(key: string) {
  const next = { ...filterValues.value }
  delete next[key]
  filterValues.value = next
}
</script>

<template>
  <div
    v-if="searchConfig || filters.length || columnToggle || $slots.default"
    class="flex flex-col gap-2.5 px-4 py-3"
  >
    <div class="flex items-center gap-2">
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <slot />

        <DataTableSearch
          v-if="searchConfig"
          v-model="search"
          :placeholder="searchConfig.placeholder"
        />

        <DataTableFilters
          v-model:filter-values="filterValues"
          :filters="filters"
        />
      </div>

      <UDropdownMenu
        v-if="columnToggle"
        :items="columnItems"
        :content="{ align: 'end' }"
      >
        <UButton
          :label="$t('table.columns')"
          color="neutral"
          variant="outline"
          size="sm"
          trailing-icon="i-lucide-chevron-down"
          class="h-9 shrink-0"
          aria-label="Columns select dropdown"
        />
      </UDropdownMenu>
    </div>

    <div
      v-if="chips.length"
      class="flex flex-wrap items-center gap-1.5"
    >
      <UBadge
        v-for="chip in chips"
        :key="chip.key"
        color="neutral"
        variant="subtle"
        size="md"
        class="gap-1 pr-0.5"
      >
        <span>{{ chip.label }}</span>
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          icon="i-lucide-x"
          class="rounded-full"
          :aria-label="$t('table.clearFilter')"
          @click="clearKey(chip.key)"
        />
      </UBadge>
    </div>
  </div>
</template>
