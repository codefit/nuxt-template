export const site = {
  name: 'Site',
  url: 'https://www.example.com',
  /** App / i18n default locale code (`cs`, `en`, …) — override via NUXT_PUBLIC_DEFAULT_LOCALE or NUXT_LOCALE_DEFAULT */
  defaultLocale: 'cs',
  /** Default HTML / OG locale (BCP 47) */
  locale: 'cs_CZ',
  themeColor: '#064E3B',
  brand: {
    legalName: 'Example s.r.o.',
    logo: '/icons/logo.svg',
    sameAs: [] as string[],
  },
  legal: {
    company: 'Example s.r.o.',
    ico: '00000000',
    address: 'Ulice 1, 110 00 Praha',
    email: 'info@example.com',
    phone: '+420 000 000 000',
    effective: '1. 1. 2026',
  },
  seo: {
    description:
      'Univerzální Nuxt starter pro prezentační a prodejní weby.',
    image: '/og-default.png',
    imageAlt: 'Site',
    twitterCard: 'summary_large_image' as const,
    twitterSite: '',
    robots: 'index, follow' as const,
  },
} as const
