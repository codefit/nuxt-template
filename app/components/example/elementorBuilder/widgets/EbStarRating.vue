<script setup lang="ts">
import type { StarRatingData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<StarRatingData>({ required: true })

const stars = computed(() =>
  Array.from({ length: data.value.max }, (_, i) => i + 1 <= data.value.value),
)
</script>

<template>
  <div :style="{ textAlign: data.align }">
    <p
      v-if="data.label"
      class="mb-1 text-sm font-medium text-neutral-700"
    >
      {{ data.label }}
    </p>
    <div class="inline-flex items-center gap-0.5">
      <UIcon
        v-for="(on, i) in stars"
        :key="i"
        name="i-lucide-star"
        class="size-5"
        :class="on ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'"
      />
    </div>
  </div>
</template>
