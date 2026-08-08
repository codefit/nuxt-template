import type { SitemapEntry, SitemapResult } from '#shared/types/export/sitemap'
import { buildSitemap } from '~~/server/services/sitemap/build'
import { resolveSitemapRoutes } from '~~/server/services/sitemap/routes'

const defaultSiteUrl = 'https://www.example.com'

/**
 * Build sitemap XML in memory (served by `server/routes/sitemap.xml.ts`).
 * Kept for tasks / local preview — does not write to disk.
 */
export async function generateSitemap(
  entries: SitemapEntry[] = [],
  siteUrl = defaultSiteUrl,
): Promise<SitemapResult> {
  const data = entries.length > 0 ? entries : await resolveSitemapRoutes()
  const xml = buildSitemap(data, siteUrl)

  return {
    xml,
    bytes: xml.length,
    count: data.length,
  }
}
