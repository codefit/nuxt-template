export type SitemapChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SitemapEntry {
  path: string
  changefreq?: SitemapChangeFreq
  priority?: number
  lastmod?: string
}

/** In-memory sitemap build result (no disk write). */
export interface SitemapResult {
  xml: string
  bytes: number
  count: number
}

/** @deprecated Use SitemapResult */
export type SitemapWritten = SitemapResult & { path?: string }
