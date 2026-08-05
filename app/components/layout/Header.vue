<script setup lang="ts">
import { site } from '#shared/config/site'

const open = ref(false)
const { nav } = useSiteNav()
const localePath = useLocalePath()
const { t } = useI18n()

watch(() => useRoute().path, () => {
  open.value = false
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default/60 bg-default/90 backdrop-blur-md">
    <SiteContainer class="flex items-center gap-5 py-5">
      <NuxtLink
        class="shrink-0 font-bold text-highlighted"
        :to="localePath('index')"
      >
        <NuxtImg
          src="/logo.svg"
          alt="Logo"
          width="100"
          height="36"
          loading="eager"
          class="h-9 w-auto"
        />
        <span class="sr-only">{{ site.name }}</span>
      </NuxtLink>

      <nav
        id="main-nav"
        class="absolute inset-x-0 top-full z-20 hidden flex-col gap-1 border-b border-default bg-default p-4 shadow-sm md:static md:flex md:flex-1 md:flex-row md:items-center md:justify-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none"
        :class="{ '!flex': open }"
        :aria-label="t('nav.main')"
      >
        <NuxtLink
          v-for="link in nav"
          :key="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-elevated hover:text-highlighted"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <LangToggle />
        <ThemeToggle />
        <UButton
          class="hidden sm:inline-flex"
          :label="t('nav.contact')"
          :to="localePath('common-contact')"
          color="primary"
        />
        <UButton
          class="md:hidden"
          color="neutral"
          variant="ghost"
          square
          aria-controls="main-nav"
          :aria-expanded="open"
          :aria-label="t('nav.menu')"
          :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
          @click="open = !open"
        />
      </div>
    </SiteContainer>
  </header>
</template>
