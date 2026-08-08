<script setup lang="ts">
import type { ButtonGroupData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<ButtonGroupData>({ required: true })

const justify = computed(() => {
  if (data.value.align === 'center') return 'center'
  if (data.value.align === 'right') return 'flex-end'
  return 'flex-start'
})
</script>

<template>
  <div
    class="flex w-full flex-wrap items-center"
    :style="{ gap: `${data.gap}px`, justifyContent: justify }"
  >
    <UButton
      v-for="item in data.items"
      :key="item.id"
      :label="item.label || 'Tlačítko'"
      :to="preview && item.href ? item.href : undefined"
      :color="item.color"
      :variant="item.variant"
      class="w-auto !inline-flex"
      :class="preview ? '' : 'pointer-events-none'"
    />
  </div>
</template>
