<script setup lang="ts">
import { site } from '#shared/config/site'

const emit = defineEmits<{
  openSidebar: []
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { user, clear: clearSession } = useUserSession()
const loggingOut = ref(false)

async function logout() {
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clearSession()
    await navigateTo(localePath('dashboard-login'))
  }
  finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header class="flex shrink-0 items-center justify-between gap-4 border-b border-default bg-default/80 px-4 py-3 backdrop-blur sm:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <UButton
        icon="i-lucide-panel-left"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        class="rounded-xl lg:hidden"
        :aria-label="t('dashboard.nav.openMenu')"
        @click="emit('openSidebar')"
      />
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="truncate text-lg font-semibold text-highlighted">
            {{ site.name }}
          </h1>
          <UBadge
            :label="t('dashboard.header.badge')"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </div>
        <p
          v-if="user?.email"
          class="truncate text-xs text-muted"
        >
          {{ user.name || user.email }}
        </p>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <UButton
        :to="localePath('dashboard-articles')"
        :label="t('dashboard.nav.newArticle')"
        icon="i-lucide-sparkles"
        color="primary"
        size="sm"
        class="hidden rounded-xl sm:inline-flex"
      />
      <UButton
        :label="t('dashboard.header.logout')"
        icon="i-lucide-log-out"
        color="neutral"
        variant="outline"
        size="sm"
        class="rounded-xl"
        :loading="loggingOut"
        @click="logout"
      />
    </div>
  </header>
</template>
