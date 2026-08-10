<script setup lang="ts">
import { BG_COLORS } from './colors'
import type { BlockDesign } from './types'

const design = defineModel<BlockDesign>({ required: true })

const customHex = computed({
  get: () => design.value.background || '#ffffff',
  set: (value: string) => {
    design.value.background = value
  },
})

const isActive = (hex: string) =>
  hex === ''
    ? !design.value.background
    : design.value.background.toLowerCase() === hex.toLowerCase()
</script>

<template>
  <div class="space-y-3 rounded-2xl bg-neutral-50 p-3">
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-semibold text-neutral-600">Pozadí bloku</span>
      <button
        type="button"
        class="text-[10px] font-semibold text-neutral-400 hover:text-neutral-700"
        @click="design.background = ''"
      >
        Reset
      </button>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="color in BG_COLORS"
        :key="color.id"
        type="button"
        class="size-7 rounded-lg transition ring-offset-1"
        :class="[
          isActive(color.hex) ? 'ring-2 ring-neutral-900' : 'ring-1 ring-black/10',
        ]"
        :style="color.hex
          ? { backgroundColor: color.hex }
          : { backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0', backgroundColor: '#fff' }"
        :title="color.label"
        @click="design.background = color.hex"
      />
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="customHex"
        type="color"
        class="size-9 shrink-0 cursor-pointer rounded-xl border-0 bg-transparent p-0"
        title="Vlastní barva"
      >
      <UInput
        v-model="customHex"
        size="sm"
        variant="soft"
        class="min-w-0 flex-1 font-mono text-xs uppercase"
        placeholder="#ffffff"
      />
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-neutral-600">Zaoblení</span>
        <span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tabular-nums text-neutral-500 shadow-sm">
          {{ design.radius }}px
        </span>
      </div>
      <input
        v-model.number="design.radius"
        type="range"
        min="0"
        max="48"
        step="2"
        class="el-range w-full"
      >
    </div>
  </div>
</template>

<style scoped>
.el-range {
  appearance: none;
  height: 1.25rem;
  background: transparent;
}
.el-range::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 999px;
  background: #e5e7eb;
}
.el-range::-webkit-slider-thumb {
  appearance: none;
  margin-top: -5px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #171717;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.el-range::-moz-range-track {
  height: 3px;
  border-radius: 999px;
  background: #e5e7eb;
}
.el-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: 0;
  border-radius: 999px;
  background: #171717;
  cursor: pointer;
}
</style>
