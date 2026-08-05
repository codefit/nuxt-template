<script setup lang="ts">
import type { SelectionMode, TablePagination } from '#shared/types/data-table'

const props = defineProps<{
  pageTotal: number
  pageSizes: number[]
  selectable?: boolean
  selectedCount: number
  matchCount: number
  selectionMode: SelectionMode
  selectionIds: number
}>()

const { t } = useI18n()

const pagination = defineModel<TablePagination>('pagination', {
  required: true,
})

const pageSizeItems = computed(() =>
  props.pageSizes.map(size => ({
    label: String(size),
    value: size,
  })),
)

const page = computed({
  get: () => pagination.value.pageIndex + 1,
  set: (value: number) => {
    pagination.value = {
      ...pagination.value,
      pageIndex: Math.max(0, value - 1),
    }
  },
})

const pageSize = computed({
  get: () => pagination.value.pageSize,
  set: (size: number) => {
    const next = Number(size)
    const resolved = props.pageSizes.includes(next)
      ? next
      : pagination.value.pageSize

    pagination.value = {
      pageIndex: 0,
      pageSize: resolved,
    }
  },
})

const rangeText = computed(() => {
  const total = props.pageTotal

  if (total === 0) {
    return t('table.showingEmpty')
  }

  const from = pagination.value.pageIndex * pagination.value.pageSize + 1
  const to = Math.min(
    (pagination.value.pageIndex + 1) * pagination.value.pageSize,
    total,
  )

  return t('table.showing', { from, to, total })
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-t border-accented px-4 py-3.5 text-sm text-muted">
    <div class="flex min-w-0 flex-col gap-0.5">
      <span>{{ rangeText }}</span>
      <span
        v-if="selectable && selectedCount"
        class="text-xs"
      >
        {{ $t('table.selected', { count: selectedCount }) }}
        <template v-if="selectionMode === 'exclude'">
          · exclude ({{ selectionIds }})
        </template>
        <template v-else-if="selectionIds">
          · include ({{ selectionIds }})
        </template>
      </span>
    </div>

    <div class="ml-auto flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="whitespace-nowrap">{{ $t('table.perPage') }}</span>
        <USelect
          v-model="pageSize"
          :items="pageSizeItems"
          value-key="value"
          class="w-20"
          size="sm"
          :aria-label="$t('table.perPage')"
        />
      </div>

      <UPagination
        v-model:page="page"
        :total="pageTotal"
        :items-per-page="pagination.pageSize"
        size="sm"
      />
    </div>
  </div>
</template>
