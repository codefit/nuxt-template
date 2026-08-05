<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()
const localePath = useLocalePath()
const { rail } = useDashboardNav()
</script>

<template>
  <aside
    class="flex h-full w-16 shrink-0 flex-col items-center gap-2 border-r border-default bg-default py-4"
    :aria-label="t('dashboard.nav.rail')"
  >
    <NuxtLink
      :to="localePath('dashboard')"
      class="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"
      :aria-label="site.name"
    >
      <NuxtImg
        src="/favicon.svg"
        :alt="site.name"
        width="24"
        height="24"
        class="size-6"
      />
    </NuxtLink>

    <nav class="flex flex-1 flex-col items-center gap-1.5">
      <UTooltip
        v-for="link in rail"
        :key="link.label"
        :text="link.label"
        :content="{ side: 'right' }"
      >
        <UButton
          :to="link.placeholder ? undefined : link.to"
          :icon="link.icon"
          :color="link.active ? 'primary' : 'neutral'"
          :variant="link.active ? 'soft' : 'ghost'"
          size="md"
          square
          class="rounded-xl"
          :aria-label="link.label"
          :aria-current="link.active ? 'page' : undefined"
          :disabled="link.placeholder"
        />
      </UTooltip>
    </nav>

    <div class="mt-auto flex flex-col items-center gap-2">
      <ThemeToggle />
      <UAvatar
        src=""
        alt="Admin"
        size="md"
        icon="i-lucide-user"
        class="ring-2 ring-default"
      />
    </div>
  </aside>
</template>
