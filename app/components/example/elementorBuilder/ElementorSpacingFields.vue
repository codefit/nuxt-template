<script setup lang="ts">
import type { BoxSides, Spacing } from './types'

const spacing = defineModel<Spacing>({ required: true })

const sides: { key: keyof BoxSides; label: string }[] = [
  { key: 'top', label: 'T' },
  { key: 'right', label: 'R' },
  { key: 'bottom', label: 'B' },
  { key: 'left', label: 'L' },
]

const setAll = (target: 'margin' | 'padding', value: number) => {
  spacing.value[target] = {
    top: value,
    right: value,
    bottom: value,
    left: value,
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="space-y-2 rounded-2xl bg-neutral-50 p-3">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-neutral-600">Margin</span>
        <button
          type="button"
          class="text-[10px] font-semibold text-neutral-400 hover:text-neutral-700"
          @click="setAll('margin', 0)"
        >
          Reset
        </button>
      </div>
      <div class="grid grid-cols-4 gap-1.5">
        <label
          v-for="side in sides"
          :key="`m-${side.key}`"
          class="space-y-0.5"
        >
          <span class="block text-center text-[10px] text-neutral-400">{{ side.label }}</span>
          <input
            v-model.number="spacing.margin[side.key]"
            type="number"
            min="0"
            max="200"
            step="4"
            class="w-full rounded-lg border-0 bg-white px-1 py-1.5 text-center text-xs tabular-nums shadow-sm outline-none ring-1 ring-black/5"
          >
        </label>
      </div>
      <div class="flex gap-1">
        <button
          v-for="n in [0, 8, 16, 24, 32]"
          :key="`mq-${n}`"
          type="button"
          class="flex-1 rounded-full bg-white py-1 text-[10px] font-semibold text-neutral-500 shadow-sm ring-1 ring-black/4 hover:bg-neutral-900 hover:text-white hover:ring-0"
          @click="setAll('margin', n)"
        >
          {{ n }}
        </button>
      </div>
    </div>

    <div class="space-y-2 rounded-2xl bg-neutral-50 p-3">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-neutral-600">Padding</span>
        <button
          type="button"
          class="text-[10px] font-semibold text-neutral-400 hover:text-neutral-700"
          @click="setAll('padding', 0)"
        >
          Reset
        </button>
      </div>
      <div class="grid grid-cols-4 gap-1.5">
        <label
          v-for="side in sides"
          :key="`p-${side.key}`"
          class="space-y-0.5"
        >
          <span class="block text-center text-[10px] text-neutral-400">{{ side.label }}</span>
          <input
            v-model.number="spacing.padding[side.key]"
            type="number"
            min="0"
            max="200"
            step="4"
            class="w-full rounded-lg border-0 bg-white px-1 py-1.5 text-center text-xs tabular-nums shadow-sm outline-none ring-1 ring-black/5"
          >
        </label>
      </div>
      <div class="flex gap-1">
        <button
          v-for="n in [0, 8, 16, 24, 32]"
          :key="`pq-${n}`"
          type="button"
          class="flex-1 rounded-full bg-white py-1 text-[10px] font-semibold text-neutral-500 shadow-sm ring-1 ring-black/4 hover:bg-neutral-900 hover:text-white hover:ring-0"
          @click="setAll('padding', n)"
        >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
