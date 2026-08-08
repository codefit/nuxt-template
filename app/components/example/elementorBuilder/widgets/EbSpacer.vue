<script setup lang="ts">
import type { SpacerData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<SpacerData>({ required: true })
</script>

<template>
  <div
    class="relative w-full"
    :style="{ height: `${data.height}px` }"
  >
    <div
      v-if="!preview"
      class="absolute inset-0 flex items-center justify-center border border-dashed border-neutral-300 bg-neutral-50/80 text-[10px] text-neutral-400"
    >
      Mezera {{ data.height }}px
    </div>
  </div>
</template>
