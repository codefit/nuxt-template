<script setup lang="ts">
import type { HeadingData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<HeadingData>({ required: true })

const el = ref<HTMLElement | null>(null)

const tagClass: Record<HeadingData['tag'], string> = {
  h1: 'text-4xl font-bold tracking-tight text-balance',
  h2: 'text-3xl font-bold tracking-tight text-balance',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold tracking-tight',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
}

const sync = () => {
  if (!el.value) return
  const next = el.value.innerText.replace(/\n/g, ' ').trim()
  if (next !== data.value.text) data.value.text = next || 'Nadpis'
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    el.value?.blur()
  }
}

watch(
  () => data.value.text,
  (text) => {
    if (!el.value || document.activeElement === el.value) return
    if (el.value.innerText !== text) el.value.innerText = text
  },
)

onMounted(() => {
  if (el.value) el.value.innerText = data.value.text
})
</script>

<template>
  <component
    :is="data.tag"
    ref="el"
    class="m-0 w-full max-w-full outline-none"
    :class="[
      tagClass[data.tag],
      data.color,
      !preview ? 'rounded-md focus:bg-sky-50/50 focus:ring-2 focus:ring-sky-400/30' : '',
    ]"
    :style="{ textAlign: data.align }"
    :contenteditable="!preview"
    spellcheck="false"
    @blur="sync"
    @keydown="onKeydown"
  />
</template>
