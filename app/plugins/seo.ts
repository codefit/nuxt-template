import { site } from '#shared/config/site'

/**
 * Global head defaults (no useI18n — vue-i18n requires Vue setup).
 * Locale lang + brand JSON-LD live in app.vue.
 * Do NOT set html class here — @nuxtjs/color-mode owns it (blocking script).
 */
export default defineNuxtPlugin(() => {
  useHead({
    titleTemplate: (title) => {
      if (!title || title === site.name) {
        return site.name
      }

      return `${title} | ${site.name}`
    },
    meta: [
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {
        name: 'msapplication-TileColor',
        content: site.themeColor,
      },
      {
        name: 'color-scheme',
        content: 'light dark',
      },
    ],
    link: [
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: site.themeColor,
      },
    ],
  })
})
