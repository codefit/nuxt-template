import { XMLBuilder } from 'fast-xml-parser'
import type { SitemapEntry } from '#shared/types/export/sitemap'

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
})

function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '')
  if (path === '/') {
    return `${base}/`
  }

  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildSitemap(entries: SitemapEntry[], siteUrl: string): string {
  const today = new Date().toISOString().slice(0, 10)

  const body = {
    urlset: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: entries.map((entry) => ({
        loc: absoluteUrl(siteUrl, entry.path),
        lastmod: entry.lastmod ?? today,
        ...(entry.changefreq ? { changefreq: entry.changefreq } : {}),
        ...(entry.priority !== undefined ? { priority: entry.priority } : {}),
      })),
    },
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${builder.build(body)}`
}
