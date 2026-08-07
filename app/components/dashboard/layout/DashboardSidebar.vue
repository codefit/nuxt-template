<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { activeSection, primary, placeholders } = useDashboardNav()

const query = ref('')
const isContent = computed(() => activeSection.value?.id === 'content')
</script>

<template>
  <aside
    class="flex h-full w-72 shrink-0 flex-col gap-5 border-r border-default bg-elevated/40 p-4"
    :aria-label="t('dashboard.nav.sidebar')"
  >
    <div class="flex items-center justify-between gap-2 px-1">
      <div class="min-w-0">
        <p class="text-xs font-medium uppercase tracking-wide text-muted">
          {{ t('dashboard.title') }}
        </p>
        <h2 class="truncate text-base font-semibold text-highlighted">
          {{ activeSection?.label }}
        </h2>
      </div>
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
      v-if="isContent"
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

    <nav
      v-if="primary.length"
      class="flex flex-col gap-1"
    >
      <p class="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        {{ t('dashboard.nav.menu') }}
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

    <div
      v-if="placeholders.length"
      class="flex flex-col gap-1"
    >
      <p class="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        {{ t('dashboard.nav.comingSoon') }}
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
