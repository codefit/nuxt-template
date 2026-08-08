import { flags } from '#shared/config/flags'

/** Default active languages — icons from `/public/icons/flags`. */
export const SEED_LANGUAGES = [
  { code: 'cs', name: 'Čeština', isDefault: 1 as const, icon: flags.cs },
  { code: 'sk', name: 'Slovenčina', isDefault: 0 as const, icon: flags.sk },
  { code: 'en', name: 'English', isDefault: 0 as const, icon: flags.en },
] as const

export type SeedLocale = (typeof SEED_LANGUAGES)[number]['code']

export type LocaleCopy = {
  name: string
  excerpt: string
  slug: string
  body: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

/**
 * CS (default) is always required. SK / EN may be omitted on purpose
 * so we can test missing-translation behaviour.
 */
export type ArticleSeed = {
  publishedAt: string
  locales: { cs: LocaleCopy } & Partial<Pick<Record<SeedLocale, LocaleCopy>, 'sk' | 'en'>>
}

function paragraphs(lines: string[]): string {
  return lines.map(line => `<p>${line}</p>`).join('')
}

const TOPICS_CS = [
  'Nuxt a SEO',
  'Překlady v databázi',
  'Schema.org microdata',
  'Feed exporty',
  'Sitemap strategie',
  'Výkon listů',
  'Cache jazyků',
  'Slug mapování',
  'Kontaktní formulář',
  'Design systém',
] as const

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function copyCs(index: number): LocaleCopy {
  const topic = TOPICS_CS[index % TOPICS_CS.length]
  const n = index + 1
  const name = `${topic}: díl ${n}`
  const excerpt = `Ukázkový článek č. ${n} o tématu „${topic}“ — výchozí (CS) překlad je vždy povinný.`
  const slug = `${slugify(topic)}-dil-${n}`

  return {
    name,
    excerpt,
    slug,
    metaTitle: name,
    metaDescription: excerpt,
    metaKeywords: `nuxt, seo, ${slugify(topic).replace(/-/g, ' ')}, dil ${n}`,
    body: paragraphs([
      `Toto je článek číslo ${n} v českém jazyce. Téma: ${topic}.`,
      'Defaultní jazyk musí mít name, excerpt, slug i body — bez toho aplikace článek v CS nevyrenderuje.',
      'Ostatní jazyky mohou u části seedů chybět záměrně (test chybějících překladů).',
    ]),
  }
}

function copySk(index: number): LocaleCopy {
  const topic = TOPICS_CS[index % TOPICS_CS.length]
  const n = index + 1
  const name = `${topic}: časť ${n}`
  const excerpt = `Ukážkový článok č. ${n} na tému „${topic}“ — slovenský preklad.`
  const slug = `${slugify(topic)}-cast-${n}`

  return {
    name,
    excerpt,
    slug,
    metaTitle: name,
    metaDescription: excerpt,
    metaKeywords: `nuxt, seo, ${slugify(topic).replace(/-/g, ' ')}, cast ${n}`,
    body: paragraphs([
      `Toto je článok číslo ${n} v slovenčine. Téma: ${topic}.`,
      'Ak tento preklad v seede chýba, výpis/detail v SK článok neuvidí (alebo spadne na 404).',
    ]),
  }
}

function copyEn(index: number): LocaleCopy {
  const topic = TOPICS_CS[index % TOPICS_CS.length]
  const n = index + 1
  const name = `${topic}: part ${n}`
  const excerpt = `Sample article #${n} about “${topic}” — English translation.`
  const slug = `${slugify(topic)}-part-${n}`

  return {
    name,
    excerpt,
    slug,
    metaTitle: name,
    metaDescription: excerpt,
    metaKeywords: `nuxt, seo, ${slugify(topic).replace(/-/g, ' ')}, part ${n}`,
    body: paragraphs([
      `This is article number ${n} in English. Topic: ${topic}.`,
      'If this locale is omitted in the seed, EN list/detail will skip or 404 the article.',
    ]),
  }
}

/**
 * 50 demo articles.
 * Coverage pattern by index (1-based `n = i + 1`):
 * - n % 5 === 1 → CS only (no SK, no EN)
 * - n % 5 === 2 → CS + SK (no EN)
 * - n % 5 === 3 → CS + EN (no SK)
 * - otherwise   → CS + SK + EN
 */
function buildSeedArticles(count = 50): ArticleSeed[] {
  const start = Date.parse('2026-01-01T09:00:00+01:00')

  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    const mod = n % 5
    const locales: ArticleSeed['locales'] = {
      cs: copyCs(i),
    }

    if (mod !== 1) {
      if (mod !== 3) {
        locales.sk = copySk(i)
      }
      if (mod !== 2) {
        locales.en = copyEn(i)
      }
    }

    return {
      publishedAt: new Date(start + i * 36 * 60 * 60 * 1000).toISOString(),
      locales,
    }
  })
}

/** Demo articles (content lives in DB translations, not i18n JSON). */
export const SEED_ARTICLES: ArticleSeed[] = buildSeedArticles(50)

export type SeedConstant = {
  group: 'company' | 'analytics' | 'contact' | 'general'
  key: string
  type: 'text'
  value: string
  label: string
  description: string
  isActive: 0 | 1
  isPrivate: 0 | 1
}

/** Default site settings — upserted by key (skipped if key exists). */
export const SEED_CONSTANTS: SeedConstant[] = [
  {
    group: 'company',
    key: 'company_name',
    type: 'text',
    value: 'Ukázková firma s.r.o.',
    label: 'Název firmy',
    description: 'Oficiální název společnosti zobrazovaný na webu.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'company',
    key: 'company_ico',
    type: 'text',
    value: '12345678',
    label: 'IČO',
    description: 'Identifikační číslo osoby.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'company',
    key: 'company_dic',
    type: 'text',
    value: 'CZ12345678',
    label: 'DIČ',
    description: 'Daňové identifikační číslo.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'contact',
    key: 'contact_email',
    type: 'text',
    value: 'info@example.com',
    label: 'E-mail',
    description: 'Veřejný kontaktní e-mail (např. patička).',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'contact',
    key: 'contact_phone',
    type: 'text',
    value: '+420 123 456 789',
    label: 'Telefon',
    description: 'Veřejný kontaktní telefon.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'contact',
    key: 'contact_address',
    type: 'text',
    value: 'Ulice 1, 110 00 Praha',
    label: 'Adresa',
    description: 'Sídlo / korespondenční adresa.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'analytics',
    key: 'analytics_ga_id',
    type: 'text',
    value: '',
    label: 'Google Analytics ID',
    description: 'Measurement ID (G-…).',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'analytics',
    key: 'analytics_gtm_id',
    type: 'text',
    value: '',
    label: 'Google Tag Manager ID',
    description: 'Container ID (GTM-…).',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'analytics',
    key: 'analytics_api_secret',
    type: 'text',
    value: '',
    label: 'GA API secret',
    description: 'Server-only tajný klíč — nikdy na klienta.',
    isActive: 1,
    isPrivate: 1,
  },
  {
    group: 'general',
    key: 'header_notice',
    type: 'text',
    value: '',
    label: 'Hláška v hlavičce',
    description: 'Krátký text nad / v hlavičce (prázdné = skryté).',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'general',
    key: 'footer_notice',
    type: 'text',
    value: 'Všechna práva vyhrazena.',
    label: 'Hláška v patičce',
    description: 'Doplňkový text v patičce webu.',
    isActive: 1,
    isPrivate: 0,
  },
  {
    group: 'general',
    key: 'site_tagline',
    type: 'text',
    value: 'Moderní web na Nuxtu',
    label: 'Slogan webu',
    description: 'Krátký tagline pro SEO / brand.',
    isActive: 1,
    isPrivate: 0,
  },
]

