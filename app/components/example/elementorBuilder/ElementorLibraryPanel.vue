<script setup lang="ts">
import { BLOCKS, blockGroups } from './blocks'
import { LAYOUTS } from './grid'
import { PLUGINS } from './plugins'
import type { DragPayload, ResponsiveCols } from './types'
import ElementorBlockSkeleton from './ElementorBlockSkeleton.vue'

const emit = defineEmits<{
  insertBlock: [blockId: string]
  addSection: [cols: ResponsiveCols[]]
  applyCustom: [raw: string]
  dragStart: [event: DragEvent, payload: DragPayload]
  dragEnd: []
}>()

const leftTab = defineModel<'blocks' | 'structure' | 'widgets'>('tab', {
  default: 'blocks',
})
const customGrid = ref('4,8')
const customError = ref('')

const customPreview = computed(() => {
  const parts = customGrid.value
    .trim()
    .split(/[xX×/,+\s|]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(Number)
  if (!parts.length || parts.some((n) => !Number.isInteger(n) || n < 1 || n > 12)) return [] as number[]
  return parts
})

const customSum = computed(() => customPreview.value.reduce((a, b) => a + b, 0))

const layoutPreviewSpans = (colsList: ResponsiveCols[]) =>
  colsList.map((c) => c.md ?? c.sm ?? c.base)

const blocksByGroup = computed(() => {
  const groups: Record<string, typeof BLOCKS> = {
    product: [],
    features: [],
    steps: [],
    trust: [],
    content: [],
    about: [],
  }
  for (const block of BLOCKS) groups[block.group]!.push(block)
  return groups
})

const pluginsByGroup = computed(() => {
  const groups: Record<string, typeof PLUGINS> = {
    basic: [],
    media: [],
    content: [],
    feedback: [],
  }
  for (const plugin of PLUGINS) groups[plugin.group]!.push(plugin)
  return groups
})

const groupLabel: Record<string, string> = {
  basic: 'Základní',
  media: 'Média',
  content: 'Obsah',
  feedback: 'Feedback',
}

const groupTone: Record<string, { card: string; icon: string; chip: string }> = {
  basic: {
    card: 'bg-emerald-50 hover:bg-emerald-100/80',
    icon: 'bg-emerald-500 text-white',
    chip: 'text-emerald-700',
  },
  media: {
    card: 'bg-rose-50 hover:bg-rose-100/80',
    icon: 'bg-rose-500 text-white',
    chip: 'text-rose-700',
  },
  content: {
    card: 'bg-sky-50 hover:bg-sky-100/80',
    icon: 'bg-sky-500 text-white',
    chip: 'text-sky-700',
  },
  feedback: {
    card: 'bg-amber-50 hover:bg-amber-100/80',
    icon: 'bg-amber-500 text-white',
    chip: 'text-amber-700',
  },
}

const onCustom = () => {
  if (!customPreview.value.length) {
    customError.value = 'Zadej čísla 1–12, např. 4,8 nebo 2/8/2'
    return
  }
  customError.value = ''
  emit('applyCustom', customGrid.value)
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="p-2.5">
      <div class="flex rounded-xl bg-neutral-100/80 p-1">
        <button
          type="button"
          class="flex-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold transition"
          :class="leftTab === 'blocks'
            ? 'bg-violet-600 text-white shadow-sm'
            : 'text-neutral-500 hover:bg-white/70 hover:text-violet-700'"
          @click="leftTab = 'blocks'"
        >
          Blocks
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold transition"
          :class="leftTab === 'structure'
            ? 'bg-sky-600 text-white shadow-sm'
            : 'text-neutral-500 hover:bg-white/70 hover:text-sky-700'"
          @click="leftTab = 'structure'"
        >
          Grid
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold transition"
          :class="leftTab === 'widgets'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-neutral-500 hover:bg-white/70 hover:text-emerald-700'"
          @click="leftTab = 'widgets'"
        >
          Widgety
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
      <template v-if="leftTab === 'blocks'">
        <div
          v-for="(list, group) in blocksByGroup"
          :key="group"
          class="mb-5"
        >
          <p class="mb-2 px-0.5 text-[11px] font-semibold text-neutral-400">
            {{ blockGroups[group as keyof typeof blockGroups] }}
          </p>
          <div class="space-y-2">
            <button
              v-for="block in list"
              :key="block.id"
              type="button"
              class="group/block w-full rounded-2xl bg-neutral-50 p-3 text-left transition hover:bg-neutral-100/90 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              @click="emit('insertBlock', block.id)"
            >
              <div class="mb-1.5 flex items-center justify-between gap-2">
                <span class="text-xs font-semibold text-neutral-800">{{ block.label }}</span>
                <span class="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-400 shadow-sm">
                  {{ block.code }}
                </span>
              </div>
              <p class="text-[10px] leading-snug text-neutral-500">
                {{ block.description }}
              </p>
              <div class="mt-2.5">
                <ElementorBlockSkeleton :type="block.skeleton" />
              </div>
            </button>
          </div>
        </div>
        <p class="px-0.5 text-[11px] leading-relaxed text-neutral-400">
          Vloží hotovou sekci. Nadpisy a texty pak edituj přímo kliknutím na plátně.
        </p>
      </template>

      <template v-else-if="leftTab === 'structure'">
        <div class="mb-4 space-y-2.5 rounded-2xl bg-neutral-50 p-3">
          <p class="text-[11px] font-semibold text-neutral-400">
            Vlastní grid
          </p>
          <input
            v-model="customGrid"
            type="text"
            placeholder="4,8 nebo 2/8/2"
            class="w-full rounded-xl border-0 bg-white px-3 py-2 text-xs tabular-nums shadow-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-neutral-900/10"
            @keydown.enter.prevent="onCustom"
          >
          <div
            v-if="customPreview.length"
            class="flex h-8 w-full gap-1"
          >
            <span
              v-for="(span, i) in customPreview"
              :key="i"
              class="flex items-center justify-center rounded-lg bg-neutral-800 text-[9px] font-semibold text-white"
              :style="{ flex: span }"
            >
              {{ span }}
            </span>
          </div>
          <p
            class="text-[10px]"
            :class="customSum === 12 ? 'text-neutral-400' : 'text-amber-600'"
          >
            Součet md: {{ customSum || '—' }}/12
            <span v-if="customSum && customSum !== 12"> (může zalamovat)</span>
          </p>
          <p
            v-if="customError"
            class="text-[10px] text-red-600"
          >
            {{ customError }}
          </p>
          <UButton
            block
            size="sm"
            color="neutral"
            :ui="{ base: 'bg-neutral-900 text-white hover:bg-neutral-800' }"
            icon="i-lucide-plus"
            label="Vložit layout"
            @click="onCustom"
          />
          <p class="text-[10px] leading-relaxed text-neutral-400">
            Formát: <code class="text-neutral-500">4,8</code>,
            <code class="text-neutral-500">2/8/2</code>,
            <code class="text-neutral-500">2x8</code>
          </p>
        </div>

        <p class="mb-2 px-0.5 text-[11px] font-semibold text-neutral-400">
          Presety
        </p>
        <div class="mb-4 grid grid-cols-2 gap-2">
          <button
            v-for="layout in LAYOUTS"
            :key="layout.id"
            type="button"
            draggable="true"
            class="flex flex-col items-center gap-2 rounded-2xl bg-neutral-50 px-2 py-3 text-left transition hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            @dragstart="emit('dragStart', $event, { type: 'preset', cols: layout.cols })"
            @dragend="emit('dragEnd')"
            @click="emit('addSection', layout.cols)"
          >
            <div class="flex h-8 w-full gap-1">
              <span
                v-for="(span, i) in layoutPreviewSpans(layout.cols)"
                :key="i"
                class="rounded-md bg-neutral-300"
                :style="{ flex: span }"
              />
            </div>
            <span class="w-full text-center text-[10px] font-semibold text-neutral-600">
              {{ layout.label }}
            </span>
          </button>
        </div>
        <p class="px-0.5 text-[11px] leading-relaxed text-neutral-400">
          Mobile-first (base 12), od <code class="text-neutral-500">md:</code> platí zadané sloupce.
        </p>
      </template>

      <template v-else>
        <div
          v-for="(list, group) in pluginsByGroup"
          :key="group"
          class="mb-4"
        >
          <p
            class="mb-2 px-0.5 text-[11px] font-semibold"
            :class="groupTone[group]?.chip ?? 'text-neutral-400'"
          >
            {{ groupLabel[group] }}
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="plugin in list"
              :key="plugin.id"
              type="button"
              draggable="true"
              class="flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              :class="groupTone[group]?.card ?? 'bg-neutral-50'"
              @dragstart="emit('dragStart', $event, { type: 'plugin', plugin: plugin.id })"
              @dragend="emit('dragEnd')"
            >
              <span
                class="flex size-10 items-center justify-center rounded-xl shadow-sm"
                :class="groupTone[group]?.icon ?? 'bg-neutral-800 text-white'"
              >
                <UIcon
                  :name="plugin.icon"
                  class="size-4"
                />
              </span>
              <span class="w-full truncate text-[11px] font-semibold text-neutral-700">
                {{ plugin.label }}
              </span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
