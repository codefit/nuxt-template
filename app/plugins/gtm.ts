import { useDataLayer } from '~/composables/useDataLayer'

/**
 * Official GTM bootstrap + dataLayer + Consent Mode defaults (denied).
 * `client/Consent.client.vue` calls gtag('consent','update', …) after choice.
 *
 * Env: NUXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gtmId = String(config.public.gtmId || '').trim()
  const { ensure, pageView } = useDataLayer()

  ensure()

  // Consent Mode defaults must run before GTM (denied until Consent updates).
  useHead({
    script: [
      {
        key: 'consent-default',
        innerHTML:
          `window.dataLayer=window.dataLayer||[];`
          + `function gtag(){dataLayer.push(arguments);}`
          + `window.gtag=gtag;`
          + `gtag('consent','default',{`
          + `analytics_storage:'denied',`
          + `ad_storage:'denied',`
          + `ad_user_data:'denied',`
          + `ad_personalization:'denied',`
          + `functionality_storage:'granted',`
          + `security_storage:'granted',`
          + `wait_for_update:500`
          + `});`,
        tagPosition: 'head',
      },
    ],
  })

  if (gtmId) {
    useHead({
      script: [
        {
          key: 'gtm-start',
          innerHTML:
            `window.dataLayer=window.dataLayer||[];`
            + `window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`,
          tagPosition: 'head',
        },
        {
          key: 'gtm',
          src: `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`,
          async: true,
          tagPosition: 'head',
        },
      ],
      noscript: [
        {
          key: 'gtm-noscript',
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
          tagPosition: 'bodyOpen',
        },
      ],
    })
  }

  if (import.meta.client) {
    const router = useRouter()

    router.afterEach((to) => {
      pageView(to.fullPath)
    })
  }
})
