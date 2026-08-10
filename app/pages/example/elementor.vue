<script setup lang="ts">
/**
 * Isolated Elementor-like builder playground — no site/dashboard chrome.
 */
definePageMeta({
  layout: false,
  pageTransition: false,
})

useHead({
  title: 'Elementor builder — example',
})
</script>

<template>
  <div class="h-dvh">
    <ClientOnly>
      <EbBuilder />
      <template #fallback>
        <div class="flex h-dvh items-center justify-center bg-neutral-100 text-sm text-neutral-500">
          Načítám editor…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
