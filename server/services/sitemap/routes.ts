import type { SitemapEntry } from '#shared/types/export/sitemap'
import { listArticleSlugEntries } from '~~/server/services/articles/list'
import { getActiveLanguages } from '~~/server/services/cache/languages'

/** Static public pages per locale (paths match i18n `pages` + prefix_except_default). */
const localeStatic: Record<string, SitemapEntry[]> = {
  cs: [
    { path: '/', changefreq: 'weekly', priority: 1 },
    { path: '/clanky', changefreq: 'weekly', priority: 0.9 },
    { path: '/galerie', changefreq: 'monthly', priority: 0.8 },
    { path: '/o-nas', changefreq: 'monthly', priority: 0.8 },
    { path: '/kontakt', changefreq: 'monthly', priority: 0.7 },
    { path: '/gdpr', changefreq: 'yearly', priority: 0.3 },
    { path: '/obchodni-podminky', changefreq: 'yearly', priority: 0.3 },
    { path: '/cookies', changefreq: 'yearly', priority: 0.3 },
  ],
  sk: [
    { path: '/sk', changefreq: 'weekly', priority: 1 },
    { path: '/sk/clanky', changefreq: 'weekly', priority: 0.9 },
    { path: '/sk/galeria', changefreq: 'monthly', priority: 0.8 },
    { path: '/sk/o-nas', changefreq: 'monthly', priority: 0.8 },
    { path: '/sk/kontakt', changefreq: 'monthly', priority: 0.7 },
    { path: '/sk/gdpr', changefreq: 'yearly', priority: 0.3 },
    { path: '/sk/obchodne-podmienky', changefreq: 'yearly', priority: 0.3 },
    { path: '/sk/cookies', changefreq: 'yearly', priority: 0.3 },
  ],
  en: [
    { path: '/en', changefreq: 'weekly', priority: 1 },
    { path: '/en/articles', changefreq: 'weekly', priority: 0.9 },
    { path: '/en/gallery', changefreq: 'monthly', priority: 0.8 },
    { path: '/en/about', changefreq: 'monthly', priority: 0.8 },
    { path: '/en/contact', changefreq: 'monthly', priority: 0.7 },
    { path: '/en/privacy', changefreq: 'yearly', priority: 0.3 },
    { path: '/en/terms', changefreq: 'yearly', priority: 0.3 },
    { path: '/en/cookies', changefreq: 'yearly', priority: 0.3 },
  ],
}

function articlePath(code: string, slug: string): string {
  if (code === 'en') {
    return `/en/articles/${slug}`
  }
  if (code === 'sk') {
    return `/sk/clanky/${slug}`
  }
  return `/clanky/${slug}`
}

export async function resolveSitemapRoutes(): Promise<SitemapEntry[]> {
  const active = await getActiveLanguages()
  const codes = new Set(active.map(lang => lang.code))

  const byLocale: Record<string, SitemapEntry[]> = {}
  for (const code of codes) {
    byLocale[code] = []
  }

  try {
    const rows = await listArticleSlugEntries()
    for (const row of rows) {
      if (!codes.has(row.code)) {
        continue
      }

      byLocale[row.code]!.push({
        path: articlePath(row.code, row.slug),
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: row.lastmod,
      })
    }
  }
  catch (error) {
    console.warn('[sitemap] article routes skipped:', error)
  }

  const entries: SitemapEntry[] = []

  // Stable order: known locales first, then any extra active codes.
  const order = [
    ...Object.keys(localeStatic),
    ...[...codes].filter(code => !(code in localeStatic)),
  ]

  for (const code of order) {
    if (!codes.has(code)) {
      continue
    }

    if (localeStatic[code]) {
      entries.push(...localeStatic[code])
    }

    entries.push(...(byLocale[code] ?? []))
  }

  return entries
}
