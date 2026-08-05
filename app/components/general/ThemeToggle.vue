<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UColorModeButton
    :aria-label="t('theme.toggle')"
    :title="t('theme.toggle')"
  />
</template>
