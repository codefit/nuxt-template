import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxthub/core', '@nuxtjs/color-mode'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  hub: {
    db: 'sqlite',
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'Nuxt — moderní web bez kompromisů',
      htmlAttrs: { lang: 'cs' },
      meta: [
        {
          name: 'description',
          content:
            'Prezentační homepage postavená na Nuxt 4. Rychlý start, čistá architektura a zážitek, který drží pohromadě.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600&display=swap',
        },
      ],
    },
  },
})
