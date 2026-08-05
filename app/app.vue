<script setup lang="ts">
import { useBrandLd } from '~/composables/jsonLd/useBrandLd'

/**
 * App root — Vue setup (required for useI18n / brand JSON-LD).
 * useLocaleHead: hreflang alternates, html lang, OG locales, locale canonical.
 */
const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})

useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
}))

useBrandLd()

/**
 * Keep transition object stable (never toggle false → object after mount).
 * Do not use `mode: 'out-in'` with NuxtPage/Suspense — Vue Transition then
 * hits null vnodes → TypeError: Cannot read properties of null (reading 'children').
 */
const pageTransition = {
  name: 'page',
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      color="var(--ui-primary)"
      :height="3"
      :throttle="0"
      :hide-delay="300"
    />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </UApp>
</template>
