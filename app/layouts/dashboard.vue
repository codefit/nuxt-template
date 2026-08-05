<script setup lang="ts">
const open = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  open.value = false
})
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-muted/40 dark:bg-default">
    <DashboardRail class="hidden sm:flex" />
    <DashboardSidebar class="hidden lg:flex" />
    <USlideover
      v-model:open="open"
      :ui="{ content: 'w-72 max-w-[85vw] p-0' }"
    >
      <template #content>
        <DashboardSidebar class="w-full border-0" />
      </template>
    </USlideover>
    <div class="flex min-w-0 flex-1 flex-col">
      <DashboardHeader @open-sidebar="open = true" />
      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
