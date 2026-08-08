<script setup lang="ts">
import { BUILDER_ICONS, iconLabel } from './icons'

interface Props {
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), { size: 'md' })

const model = defineModel<string>({ required: true })
const query = ref('')
const open = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return [...BUILDER_ICONS]
  return BUILDER_ICONS.filter((name) => iconLabel(name).includes(q))
})

const pick = (name: string) => {
  model.value = name
  open.value = false
  query.value = ''
}
</script>

<template>
  <div class="space-y-2">
    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-left text-sm hover:border-brand-600"
      @click="open = !open"
    >
      <UIcon
        :name="model"
        class="size-5 shrink-0 text-brand-800"
      />
      <span class="min-w-0 flex-1 truncate text-neutral-700">{{ iconLabel(model) }}</span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-4 text-neutral-400"
      />
    </button>

    <div
      v-if="open"
      class="rounded-md border border-neutral-200 bg-white p-2 shadow-sm"
    >
      <UInput
        v-model="query"
        size="sm"
        icon="i-lucide-search"
        placeholder="Hledat ikonu…"
        class="mb-2"
      />
      <div class="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto">
        <button
          v-for="name in filtered"
          :key="name"
          type="button"
          class="flex aspect-square items-center justify-center rounded-md hover:bg-brand-50"
          :class="model === name ? 'bg-brand-100 ring-1 ring-brand-600' : ''"
          :title="iconLabel(name)"
          @click="pick(name)"
        >
          <UIcon
            :name="name"
            :class="size === 'sm' ? 'size-4' : 'size-5'"
          />
        </button>
      </div>
      <p
        v-if="!filtered.length"
        class="py-3 text-center text-xs text-neutral-400"
      >
        Nic nenalezeno
      </p>
    </div>
  </div>
</template>
