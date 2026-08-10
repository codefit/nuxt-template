<script setup lang="ts">
import type { TabsData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<TabsData>({ required: true })
const active = ref<string>('')

watch(
  () => data.value.items,
  (items) => {
    if (!items.length) {
      active.value = ''
      return
    }
    if (!items.some((i) => i.id === active.value)) {
      active.value = items[0]?.id ?? ''
    }
  },
  { immediate: true, deep: true },
)

const current = computed(() => data.value.items.find((i) => i.id === active.value))
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap gap-1 border-b border-neutral-200">
      <button
        v-for="item in data.items"
        :key="item.id"
        type="button"
        class="-mb-px border-b-2 px-3 py-2 text-sm font-medium transition"
        :class="active === item.id
          ? 'border-brand-800 text-brand-800'
          : 'border-transparent text-neutral-500 hover:text-neutral-800'"
        @click.stop="active = item.id"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="text-sm leading-relaxed text-neutral-700">
      {{ current?.body }}
    </div>
  </div>
</template>
