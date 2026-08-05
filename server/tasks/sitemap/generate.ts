import { generateSitemap } from '~~/server/services/sitemap/run'

export default defineTask({
  meta: {
    name: 'sitemap:generate',
    description: 'Generuje sitemap.xml do public/',
  },
  async run() {
    const config = useRuntimeConfig()
    const siteUrl = config.public.siteUrl || 'https://www.example.com'
    const result = await generateSitemap([], siteUrl)

    return { result }
  },
})
