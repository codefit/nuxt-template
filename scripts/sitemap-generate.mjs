import { createJiti } from 'jiti'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Local preview of sitemap XML (stdout).
 * Production serves GET /sitemap.xml dynamically — no file write.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': join(root, 'shared'),
    '~~': root,
    '~': join(root, 'app'),
  },
})

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.example.com'
const { generateSitemap } = await jiti.import(join(root, 'server/services/sitemap/run.ts'))
const result = await generateSitemap([], siteUrl)

process.stdout.write(result.xml)
console.error(`Sitemap OK → ${result.count} URL (${result.bytes} B)`)
