<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { primary, placeholders } = useDashboardNav()

const query = ref('')

const recent = [
  { label: 'dashboard.home.recentPlaceholder1', icon: 'i-lucide-newspaper' },
  { label: 'dashboard.home.recentPlaceholder2', icon: 'i-lucide-mail' },
  { label: 'dashboard.home.recentPlaceholder3', icon: 'i-lucide-file-text' },
] as const
</script>

<template>
  <aside
    class="flex h-full w-72 shrink-0 flex-col gap-5 border-r border-default bg-elevated/40 p-4"
    :aria-label="t('dashboard.nav.sidebar')"
  >
    <div class="flex items-center justify-between gap-2 px-1">
      <h2 class="text-base font-semibold text-highlighted">
        {{ t('dashboard.title') }}
      </h2>
      <UButton
        icon="i-lucide-search"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        class="rounded-lg"
        :aria-label="t('dashboard.nav.search')"
        disabled
      />
    </div>

    <UButton
      :to="localePath('dashboard-articles')"
      :label="t('dashboard.nav.newArticle')"
      icon="i-lucide-sparkles"
      color="primary"
      class="w-full justify-center rounded-2xl"
    />

    <UInput
      v-model="query"
      :placeholder="t('dashboard.nav.searchHint')"
      icon="i-lucide-search"
      size="md"
      class="w-full"
      disabled
    />

    <nav class="flex flex-col gap-1">
      <p class="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        {{ t('dashboard.nav.sections') }}
      </p>
      <UButton
        v-for="link in primary"
        :key="link.to"
        :to="link.to"
        :label="link.label"
        :icon="link.icon"
        :color="link.active ? 'primary' : 'neutral'"
        :variant="link.active ? 'soft' : 'ghost'"
        class="w-full justify-start rounded-xl"
        :aria-current="link.active ? 'page' : undefined"
      />
    </nav>

    <div class="flex flex-col gap-1">
      <p class="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        {{ t('dashboard.nav.more') }}
      </p>
      <UButton
        v-for="link in placeholders"
        :key="link.label"
        :label="link.label"
        :icon="link.icon"
        color="neutral"
        variant="ghost"
        class="w-full justify-start rounded-xl opacity-60"
        disabled
      />
    </div>

    <div class="flex flex-col gap-1">
      <p class="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        {{ t('dashboard.nav.recent') }}
      </p>
      <UButton
        v-for="item in recent"
        :key="item.label"
        :label="t(item.label)"
        :icon="item.icon"
        color="neutral"
        variant="ghost"
        class="w-full justify-start rounded-xl"
        trailing-icon="i-lucide-ellipsis"
        disabled
      />
    </div>

    <div class="mt-auto space-y-2">
      <UButton
        :to="localePath('index')"
        :label="t('dashboard.nav.backToSite')"
        icon="i-lucide-external-link"
        color="neutral"
        variant="soft"
        class="w-full justify-center rounded-2xl"
      />
    </div>
  </aside>
</template>
