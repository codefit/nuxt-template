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

export interface SitemapWritten {
  path: string
  bytes: number
  count: number
}
