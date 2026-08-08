<script setup lang="ts">
import type { ProgressData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<ProgressData>({ required: true })

const pct = computed(() => Math.min(100, Math.max(0, data.value.value)))
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="font-medium text-neutral-800">{{ data.label }}</span>
      <span class="text-neutral-500">{{ pct }}%</span>
    </div>
    <div class="h-2.5 overflow-hidden rounded-full bg-neutral-200">
      <div
        class="h-full rounded-full transition-[width]"
        :style="{ width: `${pct}%`, backgroundColor: data.color }"
      />
    </div>
  </div>
</template>
