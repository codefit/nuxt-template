<script setup lang="ts">
import type { BlockSkeleton } from './blocks'

interface Props {
  type: BlockSkeleton
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5">
    <!-- Hero / split: text + media -->
    <div
      v-if="type === 'hero' || type === 'split'"
      class="flex h-16 gap-2"
    >
      <div class="flex flex-1 flex-col justify-center gap-1.5 py-0.5">
        <span class="h-1.5 w-10 rounded-full bg-emerald-200/80" />
        <span class="h-2 w-4/5 rounded-full bg-neutral-200" />
        <span class="h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="h-1.5 w-3/5 rounded-full bg-neutral-100" />
        <span class="mt-0.5 h-2.5 w-12 rounded-md bg-neutral-800/80" />
      </div>
      <div class="w-[42%] rounded-lg bg-neutral-200/90" />
    </div>

    <div
      v-else-if="type === 'split-reverse'"
      class="flex h-16 gap-2"
    >
      <div class="w-[42%] rounded-lg bg-neutral-200/90" />
      <div class="flex flex-1 flex-col justify-center gap-1.5 py-0.5">
        <span class="h-2 w-4/5 rounded-full bg-neutral-200" />
        <span class="h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="h-1.5 w-2/3 rounded-full bg-neutral-100" />
        <span class="h-1.5 w-1/2 rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- 3 cards -->
    <div
      v-else-if="type === 'cards-3'"
      class="space-y-1.5"
    >
      <div class="mx-auto h-1.5 w-1/2 rounded-full bg-neutral-200" />
      <div class="flex h-12 gap-1.5">
        <div
          v-for="n in 3"
          :key="n"
          class="flex flex-1 flex-col items-center gap-1 rounded-lg bg-neutral-50 p-1.5 ring-1 ring-black/4"
        >
          <span class="size-3 rounded-md bg-sky-200" />
          <span class="h-1.5 w-3/4 rounded-full bg-neutral-200" />
          <span class="h-1 w-full rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>

    <!-- 4 cards / steps -->
    <div
      v-else-if="type === 'cards-4'"
      class="flex h-14 gap-1"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="flex flex-1 flex-col items-center gap-1 rounded-lg bg-neutral-50 p-1 ring-1 ring-black/4"
      >
        <span class="h-2 w-4 rounded-full bg-neutral-300" />
        <span class="h-1.5 w-full rounded-full bg-neutral-200" />
        <span class="h-1 w-full rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- 2×2 grid -->
    <div
      v-else-if="type === 'grid-2x2'"
      class="space-y-1.5"
    >
      <span class="block h-1.5 w-2/3 rounded-full bg-neutral-200" />
      <div class="grid grid-cols-2 gap-1">
        <div
          v-for="n in 4"
          :key="n"
          class="flex items-start gap-1 rounded-md bg-neutral-50 p-1.5 ring-1 ring-black/4"
        >
          <span class="size-2.5 shrink-0 rounded bg-violet-200" />
          <div class="min-w-0 flex-1 space-y-1">
            <span class="block h-1.5 w-3/4 rounded-full bg-neutral-200" />
            <span class="block h-1 w-full rounded-full bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stacked wide cards -->
    <div
      v-else-if="type === 'stack'"
      class="space-y-1"
    >
      <span class="mx-auto mb-1 block h-1.5 w-1/2 rounded-full bg-neutral-200" />
      <div
        v-for="n in 3"
        :key="n"
        class="flex items-center gap-1.5 rounded-md bg-neutral-50 px-1.5 py-1 ring-1 ring-black/4"
      >
        <span class="size-2.5 shrink-0 rounded bg-teal-200" />
        <div class="min-w-0 flex-1 space-y-0.5">
          <span class="block h-1.5 w-1/3 rounded-full bg-neutral-200" />
          <span class="block h-1 w-4/5 rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div
      v-else-if="type === 'tabs'"
      class="space-y-1.5"
    >
      <span class="block h-2 w-1/3 rounded-full bg-neutral-200" />
      <div class="flex gap-1">
        <span class="h-2.5 flex-1 rounded-md bg-neutral-800/80" />
        <span class="h-2.5 flex-1 rounded-md bg-neutral-100" />
        <span class="h-2.5 flex-1 rounded-md bg-neutral-100" />
      </div>
      <div class="space-y-1 rounded-md bg-neutral-50 p-1.5">
        <span class="block h-1.5 w-full rounded-full bg-neutral-200" />
        <span class="block h-1.5 w-5/6 rounded-full bg-neutral-100" />
        <span class="block h-1.5 w-2/3 rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- FAQ -->
    <div
      v-else-if="type === 'faq'"
      class="flex h-16 gap-2"
    >
      <div class="flex w-[32%] flex-col justify-center gap-1">
        <span class="h-2 w-full rounded-full bg-neutral-200" />
        <span class="h-1.5 w-4/5 rounded-full bg-neutral-100" />
        <span class="mt-1 h-2.5 w-10 rounded-md bg-neutral-200" />
      </div>
      <div class="flex flex-1 flex-col justify-center gap-1">
        <span
          v-for="n in 4"
          :key="n"
          class="h-2.5 w-full rounded-md bg-neutral-100 ring-1 ring-black/4"
        />
      </div>
    </div>

    <!-- CTA strip -->
    <div
      v-else-if="type === 'cta'"
      class="flex h-12 items-center gap-2 rounded-lg bg-neutral-50 px-2 ring-1 ring-black/4"
    >
      <div class="min-w-0 flex-1 space-y-1">
        <span class="block h-2 w-2/3 rounded-full bg-neutral-200" />
        <span class="block h-1.5 w-full rounded-full bg-neutral-100" />
      </div>
      <span class="h-4 w-10 shrink-0 rounded-md bg-neutral-800/80" />
    </div>

    <!-- Alerts -->
    <div
      v-else-if="type === 'alerts'"
      class="space-y-1.5"
    >
      <div class="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1.5 ring-1 ring-emerald-100">
        <span class="size-2 rounded-full bg-emerald-400" />
        <span class="h-1.5 flex-1 rounded-full bg-emerald-200/80" />
      </div>
      <div class="flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1.5 ring-1 ring-sky-100">
        <span class="size-2 rounded-full bg-sky-400" />
        <span class="h-1.5 flex-1 rounded-full bg-sky-200/80" />
      </div>
    </div>

    <!-- Trust badges -->
    <div
      v-else-if="type === 'badges'"
      class="flex h-12 items-center justify-between gap-1 px-1"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="flex flex-1 flex-col items-center gap-1"
      >
        <span class="size-4 rounded-lg bg-neutral-200" />
        <span class="h-1 w-3/4 rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- Expert tip -->
    <div
      v-else-if="type === 'tip'"
      class="flex h-12 items-center gap-2 rounded-lg bg-amber-50/80 px-2 ring-1 ring-amber-100"
    >
      <span class="size-5 shrink-0 rounded-lg bg-amber-200" />
      <div class="min-w-0 flex-1 space-y-1">
        <span class="block h-1.5 w-1/3 rounded-full bg-amber-300/80" />
        <span class="block h-1.5 w-full rounded-full bg-amber-100" />
        <span class="block h-1.5 w-4/5 rounded-full bg-amber-100" />
      </div>
    </div>

    <!-- Article lead -->
    <div
      v-else-if="type === 'lead'"
      class="flex h-14 flex-col items-start justify-center gap-1.5 px-1"
    >
      <span class="h-1.5 w-16 rounded-full bg-emerald-200" />
      <span class="h-2.5 w-4/5 rounded-full bg-neutral-200" />
      <span class="h-1.5 w-full rounded-full bg-neutral-100" />
      <span class="h-1 w-1/3 rounded-full bg-neutral-100" />
    </div>

    <!-- Article body + sidebar -->
    <div
      v-else-if="type === 'body'"
      class="flex h-16 gap-1.5"
    >
      <div class="flex flex-[2] flex-col gap-1 py-0.5">
        <span class="h-2 w-1/2 rounded-full bg-neutral-200" />
        <span class="h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="h-1.5 w-5/6 rounded-full bg-neutral-100" />
        <span class="h-1.5 w-2/3 rounded-full bg-neutral-100" />
      </div>
      <div class="flex flex-1 flex-col gap-1 rounded-md bg-neutral-50 p-1.5 ring-1 ring-black/4">
        <span class="h-1.5 w-full rounded-full bg-sky-200" />
        <span class="h-1 w-full rounded-full bg-neutral-100" />
        <span class="h-1 w-full rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- Pull quote -->
    <div
      v-else-if="type === 'quote'"
      class="flex h-12 flex-col items-center justify-center gap-1.5 px-4"
    >
      <span class="h-2 w-full rounded-full bg-neutral-200" />
      <span class="h-2 w-4/5 rounded-full bg-neutral-200" />
      <span class="h-1 w-1/4 rounded-full bg-neutral-100" />
    </div>

    <!-- Figure + caption -->
    <div
      v-else-if="type === 'figure'"
      class="space-y-1"
    >
      <div class="h-10 rounded-lg bg-neutral-200/90" />
      <span class="mx-auto block h-1 w-2/3 rounded-full bg-neutral-100" />
    </div>

    <!-- Two columns text -->
    <div
      v-else-if="type === 'two-col'"
      class="flex h-14 gap-2"
    >
      <div
        v-for="n in 2"
        :key="n"
        class="flex flex-1 flex-col justify-center gap-1"
      >
        <span class="h-2 w-1/2 rounded-full bg-neutral-200" />
        <span class="h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="h-1.5 w-5/6 rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- Author bio -->
    <div
      v-else-if="type === 'author'"
      class="flex h-12 items-center gap-2"
    >
      <span class="size-8 shrink-0 rounded-full bg-neutral-200" />
      <div class="min-w-0 flex-1 space-y-1">
        <span class="block h-1.5 w-1/4 rounded-full bg-neutral-200" />
        <span class="block h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="block h-1 w-1/3 rounded-full bg-neutral-100" />
      </div>
    </div>

    <!-- Compare / pricing -->
    <div
      v-else-if="type === 'compare'"
      class="flex h-16 gap-1"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="flex flex-1 flex-col items-center gap-1 rounded-lg p-1 ring-1 ring-black/4"
        :class="n === 2 ? 'bg-neutral-800/5 ring-neutral-300' : 'bg-neutral-50'"
      >
        <span class="h-1 w-8 rounded-full bg-neutral-200" />
        <span class="h-2 w-10 rounded-full bg-neutral-300" />
        <span class="h-1 w-full rounded-full bg-neutral-100" />
        <span class="h-1 w-full rounded-full bg-neutral-100" />
        <span
          class="mt-auto h-2.5 w-full rounded-md"
          :class="n === 2 ? 'bg-neutral-800/80' : 'bg-neutral-200'"
        />
      </div>
    </div>

    <!-- Media + progress bars -->
    <div
      v-else-if="type === 'bars'"
      class="flex h-14 gap-2"
    >
      <div class="w-[40%] rounded-lg bg-neutral-200/90" />
      <div class="flex flex-1 flex-col justify-center gap-1.5">
        <span class="h-2 w-2/3 rounded-full bg-neutral-200" />
        <span class="h-1.5 w-full rounded-full bg-neutral-100" />
        <span class="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
          <span class="block h-full w-4/5 rounded-full bg-emerald-300" />
        </span>
        <span class="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
          <span class="block h-full w-3/5 rounded-full bg-sky-300" />
        </span>
      </div>
    </div>

    <!-- Related / use-case image cards -->
    <div
      v-else-if="type === 'media-3'"
      class="flex h-14 gap-1.5"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="flex flex-1 flex-col gap-1 overflow-hidden rounded-lg bg-neutral-50 ring-1 ring-black/4"
      >
        <div class="h-6 bg-neutral-200/90" />
        <div class="space-y-0.5 px-1 pb-1">
          <span class="block h-1.5 w-3/4 rounded-full bg-neutral-200" />
          <span class="block h-1 w-full rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>

    <!-- Problem / solution -->
    <div
      v-else-if="type === 'duo'"
      class="flex h-14 gap-1.5"
    >
      <div class="flex flex-1 flex-col justify-center gap-1 rounded-lg bg-rose-50 p-1.5 ring-1 ring-rose-100">
        <span class="h-1 w-8 rounded-full bg-rose-200" />
        <span class="h-1.5 w-full rounded-full bg-rose-100" />
        <span class="h-1 w-4/5 rounded-full bg-rose-100" />
      </div>
      <div class="flex flex-1 flex-col justify-center gap-1 rounded-lg bg-emerald-50 p-1.5 ring-1 ring-emerald-100">
        <span class="h-1 w-8 rounded-full bg-emerald-200" />
        <span class="h-1.5 w-full rounded-full bg-emerald-100" />
        <span class="h-1 w-4/5 rounded-full bg-emerald-100" />
      </div>
    </div>

    <!-- Fallback -->
    <div
      v-else
      class="flex h-10 gap-1"
    >
      <span class="flex-1 rounded-lg bg-neutral-200/80" />
      <span class="flex-1 rounded-lg bg-neutral-200/80" />
    </div>
  </div>
</template>
