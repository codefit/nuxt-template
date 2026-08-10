<script setup lang="ts">
import type { IconListData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<IconListData>({ required: true })
</script>

<template>
  <ul class="m-0 list-none space-y-2 p-0">
    <li
      v-for="item in data.items"
      :key="item.id"
      class="flex items-start gap-2 text-sm text-neutral-800"
    >
      <UIcon
        :name="item.icon"
        class="mt-0.5 size-4 shrink-0 text-brand-800"
      />
      <span>{{ item.text }}</span>
    </li>
  </ul>
</template>
