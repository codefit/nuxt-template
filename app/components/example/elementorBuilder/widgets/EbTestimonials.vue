<script setup lang="ts">
import type { TestimonialsData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<TestimonialsData>({ required: true })
</script>

<template>
  <div class="space-y-4">
    <blockquote
      v-for="item in data.items"
      :key="item.id"
      class="m-0 border-l-2 border-brand-700 pl-4"
    >
      <p class="mb-2 text-sm leading-relaxed text-neutral-700 italic">
        „{{ item.quote }}“
      </p>
      <footer class="text-xs text-neutral-500">
        <span class="font-semibold text-neutral-800">{{ item.author }}</span>
        <span v-if="item.role"> — {{ item.role }}</span>
      </footer>
    </blockquote>
  </div>
</template>
