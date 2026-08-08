<script setup lang="ts">
import type { MapsData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<MapsData>({ required: true })

const src = computed(() => {
  const q = encodeURIComponent(data.value.query || 'Praha')
  const z = data.value.zoom || 14
  return `https://maps.google.com/maps?q=${q}&z=${z}&output=embed`
})
</script>

<template>
  <div class="overflow-hidden rounded-md bg-neutral-100">
    <iframe
      :src="src"
      :title="`Mapa: ${data.query}`"
      class="w-full border-0"
      :style="{ height: `${data.height}px` }"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
    <p
      v-if="!preview"
      class="truncate px-2 py-1 text-[10px] text-neutral-400"
    >
      {{ data.query }}
    </p>
  </div>
</template>
