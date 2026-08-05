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
 * Enable page transition only after hydration.
 * `out-in` during SSR/hydrate hits Vue Transition with a null vnode
 * → TypeError: Cannot read properties of null (reading 'children').
 * Client navigations keep the animation.
 */
const ready = ref(false)
onMounted(() => {
  ready.value = true
})

const pageTransition = computed(() => {
  if (!ready.value) {
    return false
  }

  return {
    name: 'page',
    mode: 'out-in' as const,
  }
})
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
