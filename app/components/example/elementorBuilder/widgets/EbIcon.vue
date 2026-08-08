<script setup lang="ts">
import type { IconData } from '../types'
import { iconBoxTone } from '../iconTones'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<IconData>({ required: true })

const tone = computed(() => iconBoxTone(data.value.boxTone))
const boxSize = computed(() => Math.round(data.value.size * 2.2))
</script>

<template>
  <div :style="{ textAlign: data.align }">
    <span
      v-if="data.boxed"
      class="inline-flex items-center justify-center rounded-xl transition"
      :class="tone.box"
      :style="{ width: `${boxSize}px`, height: `${boxSize}px` }"
    >
      <UIcon
        :name="data.name"
        class="inline-block"
        :class="tone.icon"
        :style="{ width: `${data.size}px`, height: `${data.size}px` }"
      />
    </span>
    <UIcon
      v-else
      :name="data.name"
      class="inline-block"
      :class="data.color"
      :style="{ width: `${data.size}px`, height: `${data.size}px` }"
    />
  </div>
</template>
