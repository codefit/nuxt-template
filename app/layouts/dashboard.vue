<script setup lang="ts">
import type { DashboardSectionId } from '~~/app/composables/dashboard/useDashboardNav'

const open = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  open.value = false
})

function onSelectSection(_id: DashboardSectionId) {
  // Below lg the labeled sidebar lives in a slideover — open it after picking a hub.
  if (import.meta.client && window.matchMedia('(max-width: 1023px)').matches) {
    open.value = true
  }
}
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-muted/40 dark:bg-default">
    <DashboardRail
      class="hidden sm:flex"
      @select-section="onSelectSection"
    />
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
