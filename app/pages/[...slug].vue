<script setup lang="ts">
/**
 * Catch unknown paths so Vue Router does not warn (VUE_ROUTER_R0004).
 * No `fatal: true` — that logs Nitro [request error] [fatal] on every 404.
 */
throw createError({
  statusCode: 404,
  message: 'Page not found',
})
</script>

<template>
  <div />
</template>
