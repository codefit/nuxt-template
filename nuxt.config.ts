import { site } from './shared/config/site'

const defaultLocale =
  process.env.NUXT_PUBLIC_DEFAULT_LOCALE
  || process.env.NUXT_LOCALE_DEFAULT
  || site.defaultLocale

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    ['nuxt-jsonld', { disableOptionsAPI: true }],
    'nuxt-easy-lightbox',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    'motion-v/nuxt',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: [
      'composables',
      'composables/table',
      'composables/form',
      'composables/jsonLd',
      'composables/list',
      'composables/dashboard',
    ],
  },
  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
      // Icons used via h() in table utils are not picked by Vue SFC scan.
      icons: [
        'lucide:arrow-up-down',
        'lucide:arrow-up-narrow-wide',
        'lucide:arrow-down-wide-narrow',
        'lucide:ellipsis-vertical',
        'lucide:list-filter',
        'lucide:search',
        'lucide:check',
        'lucide:chevron-right',
        'lucide:chevron-down',
        'lucide:x',
        'lucide:calendar-range',
        'lucide:plus',
        'lucide:image-plus',
        'lucide:images',
        'lucide:image',
        'lucide:upload',
        'lucide:copy',
        'lucide:pencil',
        'lucide:file-text',
        'lucide:grip-vertical',
        // Composable-only icons (not found by Vue SFC scan).
        'lucide:layout-dashboard',
        'lucide:languages',
        'lucide:star',
        'lucide:eye-off',
        'lucide:globe',
        'lucide:download',
        'lucide:log-out',
        'lucide:eye',
        'lucide:arrow-left',
      ],
    },
  },
  hub: {
    db: {
      dialect: 'postgresql',
      // Railway: DATABASE_URL uses *.railway.internal — reachable at runtime only.
      // SQLite could migrate during build (local file); Postgres cannot.
      applyMigrationsDuringBuild: false,
    },
    // Blob: `.data/blob` unless S3_* env is set (MinIO local / R2 / AWS S3).
    // Same env keys for MinIO → Cloudflare R2 — only endpoint + credentials change.
    // https://hub.nuxt.com/docs/blob
    blob: true,
  },
  /**
   * Nuxt Image + Hub Blob:
   * - Originals live in S3/MinIO/R2, served at `/images/**`
   * - IPX resizes on the fly (local + Railway) via HTTP alias — so preview/detail
   *   widths from media config are real file sizes, not just CSS.
   * - Cloudflare hosting: set NUXT_IMAGE_PROVIDER=cloudflare (no IPX).
   * @see https://hub.nuxt.com/docs/blob#nuxt-image-integration
   */
  image: {
    provider: process.env.NUXT_IMAGE_PROVIDER || 'ipx',
    quality: 85,
    // Allow IPX to fetch blob originals over HTTP (not from public/ FS).
    domains: [
      (() => {
        try {
          return new URL(
            (process.env.NUXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, ''),
          ).host
        }
        catch {
          return 'localhost:3000'
        }
      })(),
    ],
    alias: {
      images: `${(process.env.NUXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, '')}/images`,
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
  },
  i18n: {
    locales: [
      {
        code: 'cs',
        language: 'cs-CZ',
        name: 'Čeština',
        file: 'cs.json',
        isCatchallLocale: true,
      },
      {
        code: 'sk',
        language: 'sk-SK',
        name: 'Slovenčina',
        file: 'sk.json',
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
      },
    ],
    defaultLocale,
    strategy: 'prefix_except_default',
    langDir: 'locales',
    customRoutes: 'config',
    pages: {
      'common/about': {
        cs: '/o-nas',
        sk: '/o-nas',
        en: '/about',
      },
      'common/gallery': {
        cs: '/galerie',
        sk: '/galeria',
        en: '/gallery',
      },
      'common/contact': {
        cs: '/kontakt',
        sk: '/kontakt',
        en: '/contact',
      },

      'common/gdpr': {
        cs: '/gdpr',
        sk: '/gdpr',
        en: '/privacy',
      },
      'common/cookies': {
        cs: '/cookies',
        sk: '/cookies',
        en: '/cookies',
      },
      'common/obchodni-podminky': {
        cs: '/obchodni-podminky',
        sk: '/obchodne-podmienky',
        en: '/terms',
      },
      articles: {
        cs: '/clanky',
        sk: '/clanky',
        en: '/articles',
      },
      'articles/[slug]': {
        cs: '/clanky/[slug]',
        sk: '/clanky/[slug]',
        en: '/articles/[slug]',
      },
      'dashboard/index': {
        cs: '/dashboard',
        sk: '/dashboard',
        en: '/dashboard',
      },
      'dashboard/messages': {
        cs: '/dashboard/messages',
        sk: '/dashboard/messages',
        en: '/dashboard/messages',
      },
      'dashboard/articles': {
        cs: '/dashboard/articles',
        sk: '/dashboard/articles',
        en: '/dashboard/articles',
      },
      'dashboard/languages': {
        cs: '/dashboard/languages',
        sk: '/dashboard/languages',
        en: '/dashboard/languages',
      },
      'dashboard/constants': {
        cs: '/dashboard/constants',
        sk: '/dashboard/constants',
        en: '/dashboard/constants',
      },
      'dashboard/constants/[group]': {
        cs: '/dashboard/constants/[group]',
        sk: '/dashboard/constants/[group]',
        en: '/dashboard/constants/[group]',
      },
      'dashboard/login': {
        cs: '/dashboard/login',
        sk: '/dashboard/login',
        en: '/dashboard/login',
      },
      'dashboard/register': {
        cs: '/dashboard/register',
        sk: '/dashboard/register',
        en: '/dashboard/register',
      },
      'dashboard/forgot-password': {
        cs: '/dashboard/forgot-password',
        sk: '/dashboard/forgot-password',
        en: '/dashboard/forgot-password',
      },
      'dashboard/reset-password': {
        cs: '/dashboard/reset-password',
        sk: '/dashboard/reset-password',
        en: '/dashboard/reset-password',
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || site.url,
  },
  runtimeConfig: {
    resendApiKey: '',
    recaptchaSecretKey: '',
    /** Minimum reCAPTCHA v3 score (0–1). Override: NUXT_RECAPTCHA_MIN_SCORE */
    recaptchaMinScore: 0.5,
    session: {
      // Overridden at runtime by NUXT_SESSION_PASSWORD (min 32 chars in production)
      password: '',
      maxAge: 60 * 60 * 24 * 7,
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || site.url,
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || '',
      defaultLocale,
      recaptchaSiteKey: '',
      /** Enable /dashboard/register + POST /api/auth/register. NUXT_PUBLIC_AUTH_ALLOW_REGISTER=true */
      authAllowRegister: false,
    },
  },

  app: {
    // appear: false (default) — first paint is static; animate only on client navigations
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: site.name,
      meta: [
        {
          name: 'robots',
          content: site.seo.robots,
        },
        {
          name: 'theme-color',
          content: site.themeColor,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: site.name,
        },
        {
          name: 'twitter:card',
          content: site.seo.twitterCard,
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  experimental: {
    // Off: conflicts with Vue pageTransition + freezes DOM during async setup (Nuxt docs)
    viewTransition: false,
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '0 * * * *': ['feed:generate'],
    },
  },
})