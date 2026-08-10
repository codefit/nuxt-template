<script setup lang="ts">
import type { ColSpan, ResponsiveCols } from './types'
import ElementorSelect from './ElementorSelect.vue'

const cols = defineModel<ResponsiveCols>({ required: true })

const spans: ColSpan[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const spanItems = spans.map((n) => ({ label: `${n} / 12`, value: n }))

const breakpoints: {
  key: keyof ResponsiveCols
  label: string
  hint: string
  optional: boolean
}[] = [
  { key: 'base', label: 'base', hint: 'default / < sm', optional: false },
  { key: 'sm', label: 'sm', hint: '≥ 640px', optional: true },
  { key: 'md', label: 'md', hint: '≥ 768px', optional: true },
  { key: 'lg', label: 'lg', hint: '≥ 1024px', optional: true },
  { key: 'xl', label: 'xl', hint: '≥ 1280px', optional: true },
]

const valueOf = (key: keyof ResponsiveCols): ColSpan | 0 => {
  if (key === 'base') return cols.value.base
  return cols.value[key] ?? 0
}

const itemsFor = (optional: boolean) =>
  optional
    ? [{ label: '— (auto)', value: 0 }, ...spanItems]
    : spanItems

const setValue = (key: keyof ResponsiveCols, raw: string | number) => {
  const n = Number(raw)
  if (key === 'base') {
    cols.value.base = n as ColSpan
    return
  }
  if (!n) {
    const next = { ...cols.value }
    delete next[key]
    cols.value = next
    return
  }
  cols.value = { ...cols.value, [key]: n as ColSpan }
}

const preview = computed(() => {
  const parts = [`col-span-${cols.value.base}`]
  if (cols.value.sm) parts.push(`sm:col-span-${cols.value.sm}`)
  if (cols.value.md) parts.push(`md:col-span-${cols.value.md}`)
  if (cols.value.lg) parts.push(`lg:col-span-${cols.value.lg}`)
  if (cols.value.xl) parts.push(`xl:col-span-${cols.value.xl}`)
  return parts.join(' ')
})
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs font-semibold text-neutral-500">
      Responsive cols (Tailwind 12)
    </p>
    <div class="space-y-3">
      <div
        v-for="bp in breakpoints"
        :key="bp.key"
        class="space-y-1"
      >
        <ElementorSelect
          :model-value="valueOf(bp.key)"
          :label="`${bp.label} · ${bp.hint}`"
          :items="itemsFor(bp.optional)"
          @update:model-value="setValue(bp.key, $event)"
        />
      </div>
    </div>
    <code class="block rounded-xl bg-neutral-50 px-3 py-2 text-[10px] break-all text-neutral-500">
      {{ preview }}
    </code>
  </div>
</template>
