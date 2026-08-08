<script setup lang="ts">
import type { AlertData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<AlertData>({ required: true })

const toneClass: Record<AlertData['tone'], string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  error: 'border-red-200 bg-red-50 text-red-950',
}

const toneIcon: Record<AlertData['tone'], string> = {
  info: 'i-lucide-info',
  success: 'i-lucide-circle-check',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-circle-x',
}
</script>

<template>
  <div
    class="flex gap-3 rounded-md border px-3 py-3"
    :class="toneClass[data.tone]"
  >
    <UIcon
      :name="toneIcon[data.tone]"
      class="mt-0.5 size-5 shrink-0"
    />
    <div class="min-w-0">
      <p
        v-if="data.title"
        class="m-0 text-sm font-semibold"
      >
        {{ data.title }}
      </p>
      <p class="m-0 mt-0.5 text-sm leading-relaxed opacity-90">
        {{ data.body }}
      </p>
    </div>
  </div>
</template>
