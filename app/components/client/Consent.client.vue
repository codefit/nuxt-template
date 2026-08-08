<script setup lang="ts">
/**
 * Public-site cookie banner (vanilla-cookieconsent).
 * `.client.vue` — CSR only; mount from public layouts (`default`, `auth`).
 */
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as Cc from 'vanilla-cookieconsent'

const { locale, locales, t } = useI18n()
const localePath = useLocalePath()

type LocaleCode = typeof locale.value

function text(key: string, code: LocaleCode) {
  return String(t(`cookieConsent.${key}`, {}, { locale: code }))
}

function href(name: 'common-cookies' | 'common-gdpr', code: LocaleCode) {
  const path = localePath(name, code)
  return typeof path === 'string' ? path : '#'
}

function localeCode(item: string | { code: string }): LocaleCode {
  return (typeof item === 'string' ? item : item.code) as LocaleCode
}

function translation(code: LocaleCode) {
  const cookiesHref = href('common-cookies', code)
  const privacyHref = href('common-gdpr', code)
  const cookiesLink = text('cookiesLink', code)
  const privacyLink = text('privacyLink', code)
  const tx = (key: string) => text(key, code)

  return {
    consentModal: {
      title: tx('title'),
      description: tx('description'),
      acceptAllBtn: tx('acceptAll'),
      acceptNecessaryBtn: tx('acceptNecessary'),
      showPreferencesBtn: tx('showPreferences'),
      footer: `<a href="${cookiesHref}">${cookiesLink}</a><a href="${privacyHref}">${privacyLink}</a>`,
    },
    preferencesModal: {
      title: tx('preferencesTitle'),
      acceptAllBtn: tx('acceptAll'),
      acceptNecessaryBtn: tx('acceptNecessary'),
      savePreferencesBtn: tx('savePreferences'),
      closeIconLabel: tx('close'),
      sections: [
        { title: tx('introTitle'), description: tx('introText') },
        {
          title: tx('necessaryTitle'),
          description: tx('necessaryText'),
          linkedCategory: 'necessary',
        },
        {
          title: tx('analyticsTitle'),
          description: tx('analyticsText'),
          linkedCategory: 'analytics',
        },
        {
          title: tx('marketingTitle'),
          description: tx('marketingText'),
          linkedCategory: 'marketing',
        },
        {
          title: tx('moreTitle'),
          description: `${tx('moreText')} <a href="${cookiesHref}">${cookiesLink}</a>.`,
        },
      ],
    },
  }
}

function syncGtag() {
  if (typeof window.gtag !== 'function') {
    return
  }

  const analytics = Cc.acceptedCategory('analytics')
  const marketing = Cc.acceptedCategory('marketing')

  window.gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  })
}

function stop() {
  Cc.reset()
}

async function start() {
  if (window._ccRun) {
    stop()
  }

  const translations: Record<string, () => ReturnType<typeof translation>> = {}
  for (const item of locales.value) {
    const code = localeCode(item)
    translations[code] = () => translation(code)
  }

  await Cc.run({
    autoShow: true,
    hideFromBots: false,
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: '_gid' }],
        },
      },
      marketing: {},
    },
    guiOptions: {
      consentModal: {
        layout: 'box wide',
        position: 'bottom right',
        equalWeightButtons: true,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },
    language: {
      default: locale.value,
      translations,
    },
    onConsent: syncGtag,
    onChange: syncGtag,
  })

  if (!Cc.validConsent()) {
    Cc.show(true)
  }
}

onMounted(() => {
  void start()
})

onUnmounted(stop)

watch(locale, (code) => {
  void Cc.setLanguage(code)
})

if (import.meta.hot) {
  import.meta.hot.dispose(stop)
}
</script>

<template>
  <!--
    Must render a real node: `.client.vue` is wrapped by Nuxt createClientOnly,
    which does `res.children` and crashes if render returns null
    (empty template / comment-only → TypeError after hydrate).
  -->
  <span class="hidden" hidden aria-hidden="true" />
</template>
