<script setup lang="ts">
import type { ToggleData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<ToggleData>({ required: true })
const open = ref<Record<string, boolean>>({})

watch(
  () => data.value.items.map((i) => i.id).join(','),
  () => {
    const next: Record<string, boolean> = {}
    for (const item of data.value.items) {
      next[item.id] = open.value[item.id] ?? false
    }
    open.value = next
  },
  { immediate: true },
)

const toggle = (id: string) => {
  open.value[id] = !open.value[id]
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="item in data.items"
      :key="item.id"
      class="rounded-md border border-neutral-200"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
        @click.stop="toggle(item.id)"
      >
        {{ item.title }}
        <UIcon
          :name="open[item.id] ? 'i-lucide-minus' : 'i-lucide-plus'"
          class="size-4 shrink-0 text-neutral-400"
        />
      </button>
      <div
        v-show="open[item.id]"
        class="border-t border-neutral-100 px-3 py-2 text-sm leading-relaxed text-neutral-600"
      >
        {{ item.body }}
      </div>
    </div>
  </div>
</template>
