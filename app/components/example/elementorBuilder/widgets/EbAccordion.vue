<script setup lang="ts">
import type { AccordionData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<AccordionData>({ required: true })
const openId = ref<string | null>(null)

watch(
  () => data.value.items,
  (items) => {
    if (!items.length) {
      openId.value = null
      return
    }
    if (!items.some((i) => i.id === openId.value)) {
      openId.value = items[0]?.id ?? null
    }
  },
  { immediate: true, deep: true },
)

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="divide-y divide-neutral-200 rounded-md border border-neutral-200">
    <div
      v-for="item in data.items"
      :key="item.id"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
        @click.stop="toggle(item.id)"
      >
        {{ item.title }}
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 shrink-0 text-neutral-400 transition"
          :class="openId === item.id ? 'rotate-180' : ''"
        />
      </button>
      <div
        v-show="openId === item.id"
        class="px-3 pb-3 text-sm leading-relaxed text-neutral-600"
      >
        {{ item.body }}
      </div>
    </div>
  </div>
</template>
