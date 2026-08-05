<script setup lang="ts">
/**
 * Shared client layout shell — same width & padding as Header / Footer.
 */
defineOptions({ inheritAttrs: false })

interface Props {
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
