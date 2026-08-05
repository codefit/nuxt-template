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
