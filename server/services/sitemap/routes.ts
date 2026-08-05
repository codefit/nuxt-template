import type { SitemapEntry } from '#shared/types/export/sitemap'
import { listArticleSlugEntries } from '~~/server/services/articles/list'

const staticPaths: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: 1 },
  { path: '/clanky', changefreq: 'weekly', priority: 0.9 },
  { path: '/galerie', changefreq: 'monthly', priority: 0.8 },
  { path: '/o-nas', changefreq: 'monthly', priority: 0.8 },
  { path: '/kontakt', changefreq: 'monthly', priority: 0.7 },

  { path: '/gdpr', changefreq: 'yearly', priority: 0.3 },
  { path: '/obchodni-podminky', changefreq: 'yearly', priority: 0.3 },
  { path: '/cookies', changefreq: 'yearly', priority: 0.3 },
]

const skPaths: SitemapEntry[] = [
  { path: '/sk', changefreq: 'weekly', priority: 1 },
  { path: '/sk/clanky', changefreq: 'weekly', priority: 0.9 },
  { path: '/sk/galeria', changefreq: 'monthly', priority: 0.8 },
  { path: '/sk/o-nas', changefreq: 'monthly', priority: 0.8 },
  { path: '/sk/kontakt', changefreq: 'monthly', priority: 0.7 },

  { path: '/sk/gdpr', changefreq: 'yearly', priority: 0.3 },
  { path: '/sk/obchodne-podmienky', changefreq: 'yearly', priority: 0.3 },
  { path: '/sk/cookies', changefreq: 'yearly', priority: 0.3 },
]

const enPaths: SitemapEntry[] = [
  { path: '/en', changefreq: 'weekly', priority: 1 },
  { path: '/en/articles', changefreq: 'weekly', priority: 0.9 },
  { path: '/en/gallery', changefreq: 'monthly', priority: 0.8 },
  { path: '/en/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/en/contact', changefreq: 'monthly', priority: 0.7 },

  { path: '/en/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/en/terms', changefreq: 'yearly', priority: 0.3 },
  { path: '/en/cookies', changefreq: 'yearly', priority: 0.3 },
]

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
  let byLocale: Record<string, SitemapEntry[]> = { cs: [], sk: [], en: [] }

  try {
    const rows = await listArticleSlugEntries()
    for (const row of rows) {
      const bucket = byLocale[row.code] ?? (byLocale[row.code] = [])
      bucket.push({
        path: articlePath(row.code, row.slug),
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: row.lastmod,
      })
    }
  }
  catch {
    byLocale = { cs: [], sk: [], en: [] }
  }

  return [
    ...staticPaths,
    ...byLocale.cs,
    ...skPaths,
    ...byLocale.sk,
    ...enPaths,
    ...byLocale.en,
  ]
}
