<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()
const { footer } = useSiteNav()
</script>

<template>
  <footer class="border-t border-default py-6 text-sm text-muted">
    <SiteContainer class="flex flex-wrap items-center justify-between gap-3">
      <p class="m-0">
        © {{ new Date().getFullYear() }} {{ site.name }}
      </p>
      <nav
        class="flex flex-wrap gap-x-5 gap-y-2"
        :aria-label="t('nav.footer')"
      >
        <NuxtLink
          v-for="link in footer"
          :key="link.to"
          class="hover:text-highlighted"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
        <button
          type="button"
          class="hover:text-highlighted cursor-pointer"
          data-cc="show-preferencesModal"
        >
          {{ t('cookieConsent.manage') }}
        </button>
      </nav>
    </SiteContainer>
  </footer>
</template>
