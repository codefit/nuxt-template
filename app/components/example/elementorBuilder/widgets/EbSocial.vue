<script setup lang="ts">
import type { SocialData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<SocialData>({ required: true })
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <a
      v-for="item in data.items"
      :key="item.id"
      :href="preview ? item.href : undefined"
      :aria-label="item.label"
      class="inline-flex text-brand-800 transition hover:opacity-70"
      :class="preview ? '' : 'pointer-events-none'"
      :target="preview && item.href?.startsWith('http') ? '_blank' : undefined"
      rel="noopener noreferrer"
    >
      <UIcon
        :name="item.icon"
        :style="{ width: `${data.size}px`, height: `${data.size}px` }"
      />
    </a>
  </div>
</template>
