<script setup lang="ts">
import type { DividerData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<DividerData>({ required: true })
</script>

<template>
  <div class="flex w-full items-center justify-center py-1">
    <hr
      class="m-0 border-0"
      :style="{
        width: `${data.width}%`,
        borderTopWidth: `${data.weight}px`,
        borderTopStyle: data.style,
        borderTopColor: data.color,
      }"
    >
  </div>
</template>
