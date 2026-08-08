<script setup lang="ts">
import { TEXT_COLORS } from './colors'

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="space-y-1.5">
    <span class="text-xs font-medium text-neutral-600">Barva textu</span>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="color in TEXT_COLORS"
        :key="color.id"
        type="button"
        class="size-6 rounded-full border border-neutral-200 shadow-sm transition ring-offset-1 hover:scale-110"
        :class="model === color.class ? 'ring-2 ring-brand-800' : ''"
        :style="{ backgroundColor: color.swatch }"
        :title="color.label"
        @click="model = color.class"
      />
    </div>
  </div>
</template>
