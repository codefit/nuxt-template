<script setup lang="ts">
interface Props {
  title: string
  /** Optional hero image. Default: `public/auth/hero.jpg` (replace with final art). */
  heroSrc?: string
}

withDefaults(defineProps<Props>(), {
  /** Local placeholder — replace `public/auth/hero.jpg` when you have final art. */
  heroSrc: '/auth/hero.jpg',
})
</script>

<template>
  <div class="relative flex min-h-dvh w-full items-start justify-center overflow-x-hidden overflow-y-auto px-4 py-8 sm:items-center sm:py-10">
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-[#c9d3e1]"
      aria-hidden="true"
    />

    <div class="relative z-10 my-auto w-full max-w-[400px]">
      <div class="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.35)] dark:bg-neutral-900">
        <div class="relative h-[140px] overflow-hidden sm:h-[152px]">
          <img
            :src="heroSrc"
            alt=""
            class="absolute inset-0 size-full object-cover object-[center_40%]"
            draggable="false"
          >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/25 to-black/20"
            aria-hidden="true"
          />
          <div class="relative z-10 flex h-full flex-col items-center justify-center gap-1.5 px-7 text-center">
            <h1 class="text-[1.65rem] font-bold leading-tight tracking-[-0.03em] text-white drop-shadow-sm sm:text-[1.8rem]">
              {{ title }}
            </h1>
            <p
              v-if="$slots.lead"
              class="max-w-[18rem] text-sm leading-snug text-white/90"
            >
              <slot name="lead" />
            </p>
          </div>
        </div>

        <div class="px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
