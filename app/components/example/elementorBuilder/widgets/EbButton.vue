<script setup lang="ts">
import type { ButtonData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<ButtonData>({ required: true })
</script>

<template>
  <div
    class="w-full"
    :style="{ textAlign: data.align }"
  >
    <UButton
      :label="data.label || 'Tlačítko'"
      :to="preview && data.href ? data.href : undefined"
      :color="data.color"
      :variant="data.variant"
      :block="data.block"
      :class="[
        preview ? '' : 'pointer-events-none',
        data.block ? 'w-full' : 'w-auto !inline-flex',
      ]"
    />
  </div>
</template>
