<script setup lang="ts">
import type { TextData } from '../types'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<TextData>({ required: true })

const el = ref<HTMLElement | null>(null)

const sizeClass: Record<TextData['size'], string> = {
  sm: 'text-sm leading-relaxed',
  base: 'text-[15px] leading-relaxed',
  lg: 'text-lg leading-relaxed',
}

const sync = () => {
  if (!el.value) return
  const next = el.value.innerText.trim()
  if (next !== data.value.text) data.value.text = next || 'Napište text…'
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
  <p
    ref="el"
    class="m-0 w-full max-w-full whitespace-pre-wrap outline-none"
    :class="[
      sizeClass[data.size],
      data.color,
      !preview ? 'rounded-md focus:bg-sky-50/40 focus:ring-2 focus:ring-sky-400/30' : '',
    ]"
    :style="{ textAlign: data.align }"
    :contenteditable="!preview"
    spellcheck="true"
    @blur="sync"
  />
</template>
