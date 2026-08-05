import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { SitemapEntry, SitemapWritten } from '#shared/types/export/sitemap'
import { buildSitemap } from '~~/server/services/sitemap/build'
import { resolveSitemapRoutes } from '~~/server/services/sitemap/routes'

const green = (text: string) => `\x1b[32m${text}\x1b[0m`

const defaultSiteUrl = 'https://www.example.com'

export async function generateSitemap(
  entries: SitemapEntry[] = [],
  siteUrl = defaultSiteUrl,
): Promise<SitemapWritten> {
  const data = entries.length > 0 ? entries : await resolveSitemapRoutes()
  const xml = buildSitemap(data, siteUrl)
  const path = join(process.cwd(), 'public', 'sitemap.xml')

  await writeFile(path, xml, 'utf8')

  const written: SitemapWritten = {
    path,
    bytes: xml.length,
    count: data.length,
  }

  console.log(`${green('Sitemap OK')} → sitemap.xml (${data.length} URL)`)

  return written
}
