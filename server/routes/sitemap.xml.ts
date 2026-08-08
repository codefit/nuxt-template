import { buildSitemap } from '~~/server/services/sitemap/build'
import { resolveSitemapRoutes } from '~~/server/services/sitemap/routes'

/**
 * Dynamic sitemap.xml — no disk write (Railway / ephemeral FS safe).
 * Built from static routes + published article slugs.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'https://www.example.com').replace(/\/$/, '')

  const entries = await resolveSitemapRoutes()
  const xml = buildSitemap(entries, siteUrl)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return xml
})
