<script setup lang="ts">
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import { ImageRole } from '#shared/types/media/imageRole'
import { ImageSurface } from '#shared/types/media/imageSurface'

defineOptions({ inheritAttrs: false })

export interface MediaSlide {
  src: string
  alt?: string
  collection: MediaCollection
}

interface Props {
  items: MediaSlide[]
  entity: EntityKey
  role?: typeof ImageRole[keyof typeof ImageRole]
  surface?: typeof ImageSurface[keyof typeof ImageSurface]
  /** Timed advance when more than one slide. */
  autoplay?: boolean | { delay?: number }
  arrows?: boolean
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  role: ImageRole.DETAIL,
  surface: ImageSurface.CLIENT,
  autoplay: false,
  arrows: true,
  imgClass: 'aspect-[16/9] w-full object-cover',
})

const attrs = useAttrs()
const multiple = computed(() => props.items.length > 1)
const first = computed(() => props.items[0] ?? null)

const track = useTemplateRef<HTMLElement>('track')
const active = ref(0)

const delay = computed(() => {
  if (!props.autoplay) {
    return 0
  }
  if (props.autoplay === true) {
    return 5000
  }
  return props.autoplay.delay ?? 5000
})

function goTo(index: number) {
  const el = track.value
  if (!el || !props.items.length) {
    return
  }

  const next = (index + props.items.length) % props.items.length
  active.value = next
  el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
}

function onScroll() {
  const el = track.value
  if (!el || !el.clientWidth) {
    return
  }

  const index = Math.round(el.scrollLeft / el.clientWidth)
  if (index >= 0 && index < props.items.length) {
    active.value = index
  }
}

function prev() {
  goTo(active.value - 1)
}

function next() {
  goTo(active.value + 1)
}

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (!multiple.value || !delay.value) {
    return
  }
  timer = setInterval(() => next(), delay.value)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div
    v-if="first"
    class="relative"
    :role="multiple ? 'region' : undefined"
    :aria-roledescription="multiple ? 'carousel' : undefined"
    v-bind="attrs"
  >
    <MediaImg
      v-if="!multiple"
      :src="first.src"
      :entity="entity"
      :collection="first.collection"
      :role="role"
      :surface="surface"
      :alt="first.alt"
      loading="eager"
      :img-class="imgClass"
    />

    <template v-else>
      <div
        ref="track"
        class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        @scroll.passive="onScroll"
      >
        <div
          v-for="(item, index) in items"
          :key="`${item.src}-${index}`"
          class="w-full shrink-0 snap-center snap-always"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} / ${items.length}`"
        >
          <MediaImg
            :src="item.src"
            :entity="entity"
            :collection="item.collection"
            :role="role"
            :surface="surface"
            :alt="item.alt"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :img-class="imgClass"
          />
        </div>
      </div>

      <template v-if="arrows">
        <UButton
          type="button"
          color="neutral"
          variant="solid"
          size="md"
          icon="i-lucide-chevron-left"
          class="absolute start-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 text-white ring-0 hover:bg-black/55"
          aria-label="Previous"
          @click="prev"
        />
        <UButton
          type="button"
          color="neutral"
          variant="solid"
          size="md"
          icon="i-lucide-chevron-right"
          class="absolute end-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 text-white ring-0 hover:bg-black/55"
          aria-label="Next"
          @click="next"
        />
      </template>

      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-4 pb-4 pt-14"
      >
        <div class="pointer-events-auto flex items-end justify-center gap-2.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3">
          <button
            v-for="(item, index) in items"
            :key="`thumb-${item.src}-${index}`"
            type="button"
            class="aspect-[16/9] h-16 w-auto shrink-0 overflow-hidden rounded-lg shadow-md transition duration-200 sm:h-20 md:h-24"
            :class="active === index
              ? 'scale-105 opacity-100 shadow-lg shadow-black/40'
              : 'opacity-35 shadow-black/25 hover:opacity-70 hover:shadow-lg'"
            :aria-label="item.alt || `Slide ${index + 1}`"
            :aria-current="active === index ? 'true' : undefined"
            @click="goTo(index)"
          >
            <MediaImg
              :src="item.src"
              :entity="entity"
              :collection="item.collection"
              :role="ImageRole.PREVIEW"
              :surface="surface"
              :alt="item.alt"
              loading="lazy"
              img-class="block size-full object-cover"
            />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
