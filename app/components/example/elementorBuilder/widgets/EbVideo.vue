<script setup lang="ts">
import type { VideoData } from '../types'
import { OBJECT_FIT } from '../grid'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const data = defineModel<VideoData>({ required: true })

const input = ref<HTMLInputElement | null>(null)

const radius = computed(() => Math.min(30, Math.max(0, data.value.radius ?? 0)))

const revoke = () => {
  if (data.value.src.startsWith('blob:')) {
    URL.revokeObjectURL(data.value.src)
  }
}

const onFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('video/')) return
  revoke()
  data.value.src = URL.createObjectURL(file)
}

const clear = () => {
  revoke()
  data.value.src = ''
  if (input.value) input.value.value = ''
}

const pick = () => input.value?.click()
</script>

<template>
  <div
    class="relative w-full overflow-hidden bg-slate-900 shadow-sm shadow-slate-200/80"
    :style="{ height: `${data.height}px`, borderRadius: `${radius}px` }"
  >
    <video
      v-if="data.src"
      :src="data.src"
      class="h-full w-full"
      :class="OBJECT_FIT[data.objectFit]"
      :controls="data.controls"
      :autoplay="data.autoplay"
      :muted="data.muted || data.autoplay"
      :loop="data.loop"
      playsinline
    />

    <div
      v-if="!data.src"
      class="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-slate-600 text-slate-400"
      :style="{ borderRadius: `${radius}px` }"
    >
      <UIcon
        name="i-lucide-video"
        class="size-8 opacity-60"
      />
      <p class="text-xs">
        Video · {{ data.height }}px · R{{ radius }}
      </p>
      <button
        v-if="!preview"
        type="button"
        class="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        @click.stop="pick"
      >
        Vybrat soubor
      </button>
    </div>

    <div
      v-else-if="!preview"
      class="absolute right-2 bottom-2 flex gap-1"
    >
      <button
        type="button"
        class="rounded-lg bg-white/95 px-2 py-1 text-[10px] font-medium shadow-sm ring-1 ring-slate-200"
        @click.stop="pick"
      >
        Změnit
      </button>
      <button
        type="button"
        class="rounded-lg bg-white/95 px-2 py-1 text-[10px] text-red-600 shadow-sm ring-1 ring-slate-200"
        @click.stop="clear"
      >
        Odebrat
      </button>
    </div>

    <input
      v-if="!preview"
      ref="input"
      type="file"
      accept="video/*"
      class="hidden"
      @change="onFile"
    >
  </div>
</template>
