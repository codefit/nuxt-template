import { createJiti } from 'jiti'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
await generateSitemap([], siteUrl)
