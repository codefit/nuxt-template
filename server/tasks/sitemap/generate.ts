import { generateSitemap } from '~~/server/services/sitemap/run'

/**
 * Preview / health check — sitemap is served dynamically at `/sitemap.xml`.
 * No disk write (safe on Railway).
 */
export default defineTask({
  meta: {
    name: 'sitemap:generate',
    description: 'Sestaví sitemap XML v paměti (produkce: GET /sitemap.xml)',
  },
  async run() {
    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl || 'https://www.example.com'
    const result = await generateSitemap([], siteUrl)

    return {
      result: {
        bytes: result.bytes,
        count: result.count,
      },
    }
  },
})
