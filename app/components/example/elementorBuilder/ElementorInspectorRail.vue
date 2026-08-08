<script setup lang="ts">
import { CANVAS_MAX, LAYOUTS } from './grid'
import type {
  CanvasMaxId,
  ColumnNode,
  ResponsiveCols,
  SectionNode,
  Selection,
} from './types'
import ElementorBgFields from './ElementorBgFields.vue'
import ElementorColFields from './ElementorColFields.vue'
import ElementorInspector from './ElementorInspector.vue'
import ElementorSelect from './ElementorSelect.vue'
import ElementorSpacingFields from './ElementorSpacingFields.vue'

interface Props {
  selected: Selection
  section: SectionNode | null
  column: ColumnNode | null
  widgetIndex: number
  /** Show canvas width control in empty state (mobile) */
  showCanvasSelect?: boolean
}

defineProps<Props>()

const canvasMax = defineModel<CanvasMaxId>('canvasMax', { required: true })

const emit = defineEmits<{
  applyPreset: [sectionId: string, cols: ResponsiveCols[]]
  addColumn: [sectionId: string]
}>()
</script>

<template>
  <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
    <template v-if="!selected">
      <div class="rounded-2xl bg-neutral-50 p-4">
        <p class="text-xs leading-relaxed text-neutral-500">
          Klikni na sekci, sloupec nebo widget — tady se objeví nastavení.
        </p>
      </div>
      <div
        v-if="showCanvasSelect"
        class="space-y-1.5"
      >
        <ElementorSelect
          v-model="canvasMax"
          label="Canvas max-width"
          :items="CANVAS_MAX.map((opt) => ({ label: opt.label, value: opt.id }))"
        />
      </div>
    </template>

    <template v-else-if="selected.kind === 'section' && section">
      <div class="space-y-2 rounded-2xl bg-neutral-50 p-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-neutral-600">Gap</label>
          <span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tabular-nums text-neutral-500 shadow-sm">
            {{ section.gap }}px
          </span>
        </div>
        <input
          v-model.number="section.gap"
          type="range"
          min="0"
          max="48"
          step="4"
          class="el-range w-full"
        >
      </div>
      <ElementorBgFields v-model="section.design" />
      <ElementorSpacingFields v-model="section.spacing" />
      <div class="space-y-2">
        <label class="text-xs font-semibold text-neutral-500">Layout preset</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="layout in LAYOUTS"
            :key="layout.id"
            type="button"
            class="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-600 transition hover:bg-neutral-900 hover:text-white"
            @click="emit('applyPreset', section.id, layout.cols)"
          >
            {{ layout.label }}
          </button>
        </div>
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat sloupec"
        @click="emit('addColumn', section.id)"
      />
    </template>

    <template v-else-if="selected.kind === 'column' && column">
      <ElementorColFields v-model="column.cols" />
      <div class="space-y-2">
        <label class="text-xs font-semibold text-neutral-500">Povrch sloupce</label>
        <div class="flex gap-1 rounded-xl bg-neutral-100 p-1">
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
            :class="column.surface === 'plain' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'"
            @click="column.surface = 'plain'"
          >
            Plain
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
            :class="column.surface === 'card' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'"
            @click="column.surface = 'card'"
          >
            Card
          </button>
        </div>
      </div>
      <ElementorBgFields v-model="column.design" />
      <ElementorSpacingFields v-model="column.spacing" />
      <p class="text-xs leading-relaxed text-neutral-400">
        Widgety vkládej z knihovny (vlevo) přetažením nebo přes Widgety.
      </p>
    </template>

    <ElementorInspector
      v-else-if="selected?.kind === 'widget' && column && widgetIndex >= 0 && column.widgets[widgetIndex]"
      v-model="column.widgets[widgetIndex]"
    />
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
