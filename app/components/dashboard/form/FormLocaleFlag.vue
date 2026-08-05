<script setup lang="ts">
interface Props {
  code: string
  name?: string
  icon?: string | null
  /** `sm` = field labels, `md` = language switcher (header size). */
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})
</script>

<template>
  <img
    v-if="icon"
    class="block shrink-0 rounded-sm object-cover"
    :class="size === 'sm' ? 'h-2.5 w-3.5 rounded-[2px]' : 'h-3.5 w-5'"
    :src="icon"
    :alt="name || code"
    :width="size === 'sm' ? 14 : 20"
    :height="size === 'sm' ? 10 : 14"
    loading="lazy"
    decoding="async"
  >
  <span
    v-else
    class="inline-flex shrink-0 items-center justify-center rounded-sm bg-elevated font-semibold tracking-wide uppercase"
    :class="size === 'sm' ? 'px-0.5 text-[9px] leading-none' : 'px-1 text-xs'"
  >{{ code }}</span>
</template>
