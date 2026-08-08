/**
 * Dynamic robots.txt from runtime site URL (SSR / Nitro).
 * Prefer this over a static public/robots.txt so Sitemap matches NUXT_PUBLIC_SITE_URL.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'https://www.example.com').replace(/\/$/, '')

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return [
    'User-Agent: *',
    'Allow: /',
    '',
    // Auth / admin (prefix_except_default: cs bare, en/sk prefixed)
    'Disallow: /dashboard',
    'Disallow: /en/dashboard',
    'Disallow: /sk/dashboard',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
