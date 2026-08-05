<script setup lang="ts">
import type { BulkAction } from '#shared/types/ui/data-table'

defineProps<{
  bulkValue?: string
  bulkActions: BulkAction[]
  bulkPending?: boolean
  selectedCount: number
  selectionHint?: string | null
}>()

const emit = defineEmits<{
  'update:bulkValue': [value: string | undefined]
  clear: []
}>()
</script>

<template>
  <div
    v-if="selectedCount > 0 && bulkActions.length"
    class="flex flex-wrap items-center gap-2 bg-elevated/50 px-4 py-3"
  >
    <span class="text-sm font-medium">
      Vybráno: {{ selectedCount }}
      <span
        v-if="selectionHint"
        class="font-normal text-muted"
      >
        ({{ selectionHint }})
      </span>
    </span>

    <USelect
      :model-value="bulkValue"
      :items="bulkActions"
      placeholder="Vyberte akci…"
      value-key="value"
      class="w-56"
      size="sm"
      :disabled="bulkPending"
      :loading="bulkPending"
      @update:model-value="emit('update:bulkValue', $event as string | undefined)"
    />

    <UButton
      color="neutral"
      variant="ghost"
      label="Zrušit výběr"
      size="sm"
      class="ml-auto"
      :disabled="bulkPending"
      @click="emit('clear')"
    />
  </div>
</template>
